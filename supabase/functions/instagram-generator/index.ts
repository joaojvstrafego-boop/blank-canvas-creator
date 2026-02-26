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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

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

    // Generate image using Gemini 2.0 Flash (supports image generation)
    const imagePrompt = `Generate a professional food photography image. Vertical format 4:5 aspect ratio (1080x1350 pixels, Instagram post format).
${typeImageDesc}
Style: ${styleDesc}
Subject related to: ${prompt}
CRITICAL RULES:
- DO NOT include ANY text, words, letters, numbers, logos, or watermarks.
- This is ONLY a background photo. Pure visual, zero text. Clean photography only.`;

    const imageResponsePromise = fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imagePrompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      }
    );

    // Generate text content + caption using Gemini 2.5 Flash
    const textResponsePromise = fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Eres una community manager y diseñadora experta para "Palomitas Redonditas", un negocio de palomitas gourmet.

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
{"headline":"TU HEADLINE AQUÍ","subtitle":"Tu subtítulo complementario aquí","caption":"El caption completo con emojis y hashtags aquí"}`
            }]
          },
          contents: [{
            parts: [{ text: `Tipo de post: ${postType || "tip"}. Tema: ${prompt}.` }]
          }],
        }),
      }
    );

    const [imageResponse, textResponse] = await Promise.all([imageResponsePromise, textResponsePromise]);

    // Handle image response
    if (!imageResponse.ok) {
      const errText = await imageResponse.text();
      console.error("Gemini image error:", imageResponse.status, errText);
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (imageResponse.status === 403) {
        return new Response(JSON.stringify({ error: "API key bloqueada. Genera una nueva GEMINI_API_KEY." }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Image generation failed: ${imageResponse.status}`);
    }

    const imageData = await imageResponse.json();
    let imageUrl = "";

    // Extract image from Gemini response (inline_data format)
    const parts = imageData?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      console.error("No image in Gemini response:", JSON.stringify(imageData).substring(0, 1000));
      throw new Error("No image generated");
    }

    // Handle text response
    let headline = "PALOMITAS GOURMET";
    let subtitle = "El sabor que enamora";
    let caption = "🍿 ¡Palomitas gourmet que enamoran! ✨\n\n#PalomitasGourmet #Popcorn";

    if (textResponse.ok) {
      const textData = await textResponse.json();
      const raw = textData?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text ?? "")
        .join("")
        .trim() || "";
      try {
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
    } else {
      const errText = await textResponse.text();
      console.error("Text generation error:", textResponse.status, errText);
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
