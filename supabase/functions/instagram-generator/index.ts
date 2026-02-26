import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style, postType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleDescriptions: Record<string, string> = {
      elegant: "luxury dark moody food photography, golden rim lighting, bokeh, deep shadows, rich tones",
      vibrant: "bright colorful food photography, bold saturated colors, gradient colored lighting, neon accents, energetic",
      minimal: "clean minimal food photography, white marble background, soft natural light, airy and bright",
      rustic: "rustic cozy food photography, wooden table, warm golden hour light, earth tones, craft paper elements",
    };

    const postTypeImageDesc: Record<string, string> = {
      tip: "close-up of beautifully arranged gourmet popcorn with decorative elements around it",
      promo: "eye-catching arrangement of multiple popcorn flavors in premium packaging or bowls",
      recipe: "flat-lay of popcorn ingredients neatly arranged with the finished popcorn in center",
      motivational: "artistic abstract shot of popcorn with dramatic lighting and depth of field",
      beforeAfter: "split composition showing plain corn kernels on one side and gorgeous caramelized popcorn on the other",
      carousel: "hero shot of the most beautiful gourmet popcorn overflowing from a premium container",
    };

    const styleDesc = styleDescriptions[style] || styleDescriptions.vibrant;
    const typeImageDesc = postTypeImageDesc[postType] || postTypeImageDesc.tip;

    // Generate CLEAN background image (NO text)
    const imagePrompt = `Professional food photography, vertical format 4:5 aspect ratio (1080x1350 pixels, Instagram post format).
${typeImageDesc}
Style: ${styleDesc}
Subject related to: ${prompt}
CRITICAL RULES:
- The image MUST be perfectly SQUARE (1:1 ratio), like an Instagram post.
- DO NOT include ANY text, words, letters, numbers, logos, or watermarks.
- This is ONLY a background photo. Pure visual, zero text. Clean photography only.`;

    const imageResponsePromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    // Generate text content + caption in parallel
    const textResponsePromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres una community manager y diseñadora experta para "Palomitas Redonditas", un negocio de palomitas gourmet.

Debes generar DOS cosas:

1. TEXTO PARA LA IMAGEN (overlay): El texto que irá SOBRE la imagen del post. Debe ser corto y impactante.
2. CAPTION: El texto que va en la descripción del post de Instagram.

Reglas para TEXTO DE IMAGEN:
- headline: máximo 6-8 palabras, impactante, en mayúsculas
- subtitle: máximo 15 palabras, complementa el headline
- El texto debe ser en español

Reglas para CAPTION:
- Hook inicial que capture atención
- Contenido de valor
- Call-to-action
- 15-20 hashtags

Responde EXACTAMENTE en este formato JSON (sin markdown, solo JSON puro):
{"headline":"TU HEADLINE AQUÍ","subtitle":"Tu subtítulo complementario aquí","caption":"El caption completo con emojis y hashtags aquí"}`,
          },
          {
            role: "user",
            content: `Tipo de post: ${postType || "tip"}. Tema: ${prompt}.`,
          },
        ],
      }),
    });

    const [imageResponse, textResponse] = await Promise.all([imageResponsePromise, textResponsePromise]);

    // Handle image response
    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, t);
      throw new Error("Error generating image");
    }

    const imageData = await imageResponse.json();
    let imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      const content = imageData.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.startsWith("data:image")) {
        imageUrl = content;
      } else if (Array.isArray(content)) {
        const imgPart = content.find((p: any) => p.type === "image_url" || p.type === "image");
        imageUrl = imgPart?.image_url?.url || imgPart?.url;
      }
    }
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(imageData).substring(0, 1000));
      throw new Error("No image generated");
    }

    // Handle text response
    let headline = "PALOMITAS GOURMET";
    let subtitle = "El sabor que enamora";
    let caption = "🍿 ¡Palomitas gourmet que enamoran! ✨\n\n#PalomitasGourmet #Popcorn";

    if (textResponse.ok) {
      const textData = await textResponse.json();
      const raw = textData.choices?.[0]?.message?.content || "";
      try {
        // Extract JSON from response (might have markdown wrapping)
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          headline = parsed.headline || headline;
          subtitle = parsed.subtitle || subtitle;
          caption = parsed.caption || caption;
        }
      } catch {
        console.error("Failed to parse text response:", raw.substring(0, 500));
      }
    }

    return new Response(JSON.stringify({ imageUrl, headline, subtitle, caption }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("instagram-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
