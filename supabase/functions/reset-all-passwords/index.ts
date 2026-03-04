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

    // Parse optional page param for chunked processing
    const url = new URL(req.url);
    const startPage = parseInt(url.searchParams.get("page") || "1");
    const maxPages = parseInt(url.searchParams.get("max") || "3"); // process 3 pages (3000 users) per call

    const results = { updated: 0, errors: 0, processed: 0, nextPage: 0 };

    for (let p = startPage; p < startPage + maxPages; p++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: p, perPage: 1000 });
      if (error) throw error;
      if (!data?.users || data.users.length === 0) {
        results.nextPage = 0; // done
        break;
      }

      // Process in parallel batches of 10
      for (let i = 0; i < data.users.length; i += 10) {
        const batch = data.users.slice(i, i + 10);
        const promises = batch.map((u) =>
          supabaseAdmin.auth.admin.updateUserById(u.id, { password: "1234" })
        );
        const batchResults = await Promise.all(promises);
        batchResults.forEach((r) => {
          if (r.error) results.errors++;
          else results.updated++;
        });
      }

      results.processed += data.users.length;
      if (data.users.length < 1000) {
        results.nextPage = 0;
        break;
      } else {
        results.nextPage = p + 1;
      }
    }

    console.log(`Password reset: ${results.updated} updated, ${results.errors} errors, ${results.processed} processed`);

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset passwords error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
