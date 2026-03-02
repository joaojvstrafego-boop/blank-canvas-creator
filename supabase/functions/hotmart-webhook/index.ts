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

    // Hotmart sends different payload formats depending on the webhook version
    // Common fields: event, data.buyer.email
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

    console.log(`Processing event: ${event}, email: ${email}`);

    // Approved purchase events → create user
    const approvedEvents = [
      "PURCHASE_APPROVED",
      "purchase.approved", 
      "PURCHASE_COMPLETE",
      "purchase_approved",
      "approved",
    ];

    // Refund/chargeback events → ban user
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
      approvedEvents.some((e) => e.toLowerCase() === eventLower) ||
      !event;
    const isRevoke = revokeEvents.some((e) => e.toLowerCase() === eventLower);

    if (!isApproved && !isRevoke) {
      console.log(`Ignoring event: ${event}`);
      return new Response(
        JSON.stringify({ message: `Event ${event} ignored` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === REVOKE ACCESS (refund/chargeback) ===
    if (isRevoke) {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const user = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        console.log(`User ${email} not found, nothing to revoke`);
        return new Response(
          JSON.stringify({ message: "User not found", email }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Ban the user (prevents login)
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { ban_duration: "876600h" } // ~100 years
      );

      if (banError) {
        console.error("Error banning user:", banError.message);
        return new Response(
          JSON.stringify({ error: banError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`User ${email} banned due to ${event}`);
      return new Response(
        JSON.stringify({ message: "User access revoked", email, reason: event }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      console.log(`User ${email} already exists, skipping creation`);
      return new Response(
        JSON.stringify({ message: "User already exists", email }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user with password 1234
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password: "1234",
        email_confirm: true, // auto-confirm email
      });

    if (createError) {
      console.error("Error creating user:", createError.message);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User created successfully: ${email}`);
    return new Response(
      JSON.stringify({ message: "User created", email, userId: newUser.user.id }),
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
