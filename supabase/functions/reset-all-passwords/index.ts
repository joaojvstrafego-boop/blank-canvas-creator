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

    // First, try one user to see the error
    const { data: firstPage } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (firstPage?.users?.[0]) {
      const testResult = await supabaseAdmin.auth.admin.updateUserById(firstPage.users[0].id, { password: "123456" });
      console.log("Test update result:", JSON.stringify(testResult));
    }

    // Get all users
    const allUsers: { id: string; email: string }[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (data?.users && data.users.length > 0) {
        data.users.forEach((u) => allUsers.push({ id: u.id, email: u.email || "" }));
        hasMore = data.users.length === 1000;
      } else {
        hasMore = false;
      }
      page++;
    }

    const results = { updated: 0, errors: 0, sampleError: "", total: allUsers.length };

    // Process in batches of 10
    for (let i = 0; i < allUsers.length; i += 10) {
      const batch = allUsers.slice(i, i + 10);
      const promises = batch.map((u) =>
        supabaseAdmin.auth.admin.updateUserById(u.id, { password: "123456" })
      );
      const batchResults = await Promise.all(promises);
      batchResults.forEach((r) => {
        if (r.error) {
          results.errors++;
          if (!results.sampleError) results.sampleError = r.error.message;
        } else {
          results.updated++;
        }
      });
    }

    console.log(`Password reset done: ${results.updated}/${results.total} updated, ${results.errors} errors`);

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
