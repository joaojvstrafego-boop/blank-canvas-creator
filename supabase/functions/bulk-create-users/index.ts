import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails)) {
      return new Response(
        JSON.stringify({ error: "emails array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existingEmails = new Set(
      (existingUsers?.users || []).map((u) => u.email?.toLowerCase())
    );

    // If more than 1000 users, paginate
    let page = 2;
    let hasMore = (existingUsers?.users?.length || 0) === 1000;
    while (hasMore) {
      const { data: moreUsers } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (moreUsers?.users) {
        moreUsers.users.forEach((u) => existingEmails.add(u.email?.toLowerCase()));
        hasMore = moreUsers.users.length === 1000;
      } else {
        hasMore = false;
      }
      page++;
    }

    const results = { created: [] as string[], skipped: [] as string[], errors: [] as { email: string; error: string }[] };

    for (const email of emails) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) continue;

      if (existingEmails.has(normalizedEmail)) {
        results.skipped.push(normalizedEmail);
        continue;
      }

      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: "123456",
        email_confirm: true,
      });

      if (error) {
        results.errors.push({ email: normalizedEmail, error: error.message });
      } else {
        results.created.push(normalizedEmail);
        existingEmails.add(normalizedEmail);
      }
    }

    console.log(`Bulk create: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors`);

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Bulk create error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
