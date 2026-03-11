import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    console.log("Hotmart webhook received:", JSON.stringify(body));

    const event = body.event || body.status;
    const email =
      body?.data?.buyer?.email ||
      body?.buyer?.email ||
      body?.email;

    if (!email) {
      console.error("No email found in webhook payload:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ error: "No email found in payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`Processing event: ${event}, email: ${normalizedEmail}`);

    const approvedEvents = [
      "PURCHASE_APPROVED",
      "purchase.approved",
      "PURCHASE_COMPLETE",
      "purchase_approved",
      "approved",
    ];

    const revokeEvents = [
      "PURCHASE_REFUNDED",
      "purchase.refunded",
      "PURCHASE_CHARGEBACK",
      "purchase.chargeback",
      "PURCHASE_CANCELED",
      "purchase.canceled",
      "refunded",
      "chargeback",
      "canceled",
    ];

    const eventLower = String(event).toLowerCase();
    const isApproved =
      approvedEvents.some((e) => e.toLowerCase() === eventLower) || !event;
    const isRevoke = revokeEvents.some((e) => e.toLowerCase() === eventLower);

    if (!isApproved && !isRevoke) {
      console.log(`Ignoring event: ${event}`);
      return new Response(
        JSON.stringify({ message: `Event ${event} ignored` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === REVOKE ACCESS ===
    if (isRevoke) {
      // Search for user by email using paginated approach
      const user = await findUserByEmail(supabaseAdmin, normalizedEmail);

      if (!user) {
        console.log(`User ${normalizedEmail} not found, nothing to revoke`);
        return new Response(
          JSON.stringify({ message: "User not found", email: normalizedEmail }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { ban_duration: "876600h" }
      );

      if (banError) {
        console.error("Error banning user:", banError.message);
        return new Response(
          JSON.stringify({ error: banError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`User ${normalizedEmail} banned due to ${event}`);
      return new Response(
        JSON.stringify({ message: "User access revoked", email: normalizedEmail, reason: event }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === APPROVED PURCHASE: Try to create user directly ===
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: "123456",
        email_confirm: true,
      });

    if (createError) {
      // If user already exists, that's fine - unban them in case they were banned before
      if (
        createError.message.includes("already been registered") ||
        createError.message.includes("already exists") ||
        createError.status === 422
      ) {
        console.log(`User ${normalizedEmail} already exists, ensuring access is active`);

        // Find and unban the user in case they were previously banned
        const existingUser = await findUserByEmail(supabaseAdmin, normalizedEmail);
        if (existingUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            ban_duration: "none",
          });
          console.log(`User ${normalizedEmail} unbanned (re-purchase)`);
        }

        return new Response(
          JSON.stringify({ message: "User already exists, access ensured", email: normalizedEmail }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("Error creating user:", createError.message);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User created successfully: ${normalizedEmail}, userId: ${newUser.user.id}`);
    return new Response(
      JSON.stringify({ message: "User created", email: normalizedEmail, userId: newUser.user.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper: find user by email with pagination (avoids the listUsers bug)
async function findUserByEmail(supabaseAdmin: any, email: string) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error || !data?.users?.length) break;

    const found = data.users.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );
    if (found) return found;

    if (data.users.length < perPage) break;
    page++;
  }

  return null;
}
