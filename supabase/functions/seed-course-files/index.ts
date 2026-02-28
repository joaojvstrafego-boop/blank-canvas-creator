import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // The base URL where the app is published - we fetch files from there
    const { baseUrl } = await req.json();
    if (!baseUrl) throw new Error("baseUrl is required");

    const files = [
      { path: "PALOMITAS_REDONDITAS.pdf", contentType: "application/pdf" },
      { path: "publicaciones.pdf", contentType: "application/pdf" },
      { path: "leyendas.pdf", contentType: "application/pdf" },
      { path: "audio-intro.mp3", contentType: "audio/mpeg" },
    ];

    const results: { file: string; status: string }[] = [];

    for (const file of files) {
      // Check if already exists
      const { data: existing } = await supabase.storage
        .from("course-files")
        .list("", { search: file.path, limit: 1 });

      if (existing && existing.length > 0 && existing.some(f => f.name === file.path)) {
        results.push({ file: file.path, status: "already exists" });
        continue;
      }

      // Download from the app's public folder
      const url = `${baseUrl.replace(/\/$/, "")}/${file.path}`;
      const res = await fetch(url);
      if (!res.ok) {
        results.push({ file: file.path, status: `fetch failed: ${res.status}` });
        continue;
      }

      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const { error } = await supabase.storage
        .from("course-files")
        .upload(file.path, arrayBuffer, {
          contentType: file.contentType,
          upsert: true,
        });

      results.push({ file: file.path, status: error ? `error: ${error.message}` : "uploaded" });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
