import { useState, useRef, useCallback } from "react";
import { Sparkles, Download, Copy, Check, Loader2, Wand2, Lightbulb, Tag, BookOpen, Heart, ArrowLeftRight, Layers } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  { id: "vibrant", label: "Vibrante", emoji: "🎨", desc: "Neon, moderno" },
  { id: "elegant", label: "Elegante", emoji: "✨", desc: "Lujo, premium" },
  { id: "minimal", label: "Minimalista", emoji: "🤍", desc: "Limpio, editorial" },
  { id: "rustic", label: "Rústico", emoji: "🪵", desc: "Artesanal, cálido" },
];

const POST_TYPES = [
  { id: "tip", label: "Dica / Tip", icon: Lightbulb, desc: "Post con consejo o tip útil", color: "text-yellow-400" },
  { id: "promo", label: "Promoción", icon: Tag, desc: "Oferta, descuento o novedad", color: "text-green-400" },
  { id: "recipe", label: "Receta", icon: BookOpen, desc: "Receta o ingredientes", color: "text-orange-400" },
  { id: "motivational", label: "Inspiración", icon: Heart, desc: "Frase motivacional", color: "text-pink-400" },
  { id: "beforeAfter", label: "Antes/Después", icon: ArrowLeftRight, desc: "Transformação do produto", color: "text-blue-400" },
  { id: "carousel", label: "Portada Carrusel", icon: Layers, desc: "Cover de carrusel", color: "text-purple-400" },
];

const PROMPTS: Record<string, string[]> = {
  tip: [
    "3 tips para conservar tus palomitas frescas",
    "El secreto de la caramelización perfecta",
    "Cómo elegir el mejor maíz mushroom",
  ],
  promo: [
    "Nuevo sabor de temporada: Fresa con chocolate",
    "Promoción 2x1 en palomitas de Nutella",
    "Pack regalo especial de temporada",
  ],
  recipe: [
    "Receta de palomitas de Oreo paso a paso",
    "Cómo hacer palomitas de leche nido",
    "Ingredientes para palomitas de coco y chocolate",
  ],
  motivational: [
    "Emprender con palomitas gourmet es posible",
    "De mi cocina a un negocio rentable",
    "La constancia es la clave del éxito",
  ],
  beforeAfter: [
    "De maíz simple a palomitas gourmet premium",
    "Transformación del sabor con caramelo",
    "Antes: palomitas normales. Después: obra de arte",
  ],
  carousel: [
    "5 errores al emprender con palomitas",
    "Guía completa de sabores gourmet",
    "Todo lo que necesitas para empezar tu negocio",
  ],
};

interface PostResult {
  imageUrl: string;
  headline: string;
  subtitle: string;
  caption: string;
}

const OVERLAY_STYLES: Record<string, {
  bgOverlay: string;
  headlineColor: string;
  subtitleColor: string;
  brandColor: string;
  accentColor: string;
}> = {
  vibrant: {
    bgOverlay: "rgba(0,0,0,0.45)",
    headlineColor: "#FFFFFF",
    subtitleColor: "#F0F0F0",
    brandColor: "#FF4444",
    accentColor: "#FF6B35",
  },
  elegant: {
    bgOverlay: "rgba(0,0,0,0.55)",
    headlineColor: "#F5E6C8",
    subtitleColor: "#D4C5A9",
    brandColor: "#C8A96E",
    accentColor: "#8B7355",
  },
  minimal: {
    bgOverlay: "rgba(255,255,255,0.75)",
    headlineColor: "#1A1A1A",
    subtitleColor: "#444444",
    brandColor: "#E63946",
    accentColor: "#457B9D",
  },
  rustic: {
    bgOverlay: "rgba(30,15,5,0.5)",
    headlineColor: "#FFF8E7",
    subtitleColor: "#E8D5B7",
    brandColor: "#D4A373",
    accentColor: "#8B5E3C",
  },
};

// Render the composite post to a canvas and return data URL
const renderPostToCanvas = (
  img: HTMLImageElement,
  headline: string,
  subtitle: string,
  style: string,
  brandName: string,
  instagramHandle: string,
): string => {
  const w = 1080;
  const h = 1350; // 4:5 Instagram vertical format
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Draw background image (cover fit to 4:5)
  const targetRatio = w / h;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgRatio > targetRatio) {
    // Image is wider — crop sides
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image is taller — crop top/bottom
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

  const colors = OVERLAY_STYLES[style] || OVERLAY_STYLES.vibrant;
  const isMinimal = style === "minimal";

  // Overlay gradient
  if (isMinimal) {
    const grad = ctx.createLinearGradient(0, h * 0.3, 0, h);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.85)");
    grad.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else {
    const grad = ctx.createLinearGradient(0, h * 0.15, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.4)");
    grad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.25);
    topGrad.addColorStop(0, "rgba(0,0,0,0.4)");
    topGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, h * 0.25);
  }

  // Accent bar at top
  ctx.fillStyle = colors.brandColor;
  ctx.fillRect(60, 60, 60, 6);

  // Brand name at top
  ctx.font = "600 28px 'DM Sans', Arial, sans-serif";
  ctx.fillStyle = colors.brandColor;
  ctx.textAlign = "left";
  ctx.fillText((brandName || "PALOMITAS REDONDITAS").toUpperCase(), 60, 104);

  // Headline - word wrap
  ctx.font = "bold 72px 'Arial Black', 'Bebas Neue', Impact, sans-serif";
  ctx.fillStyle = colors.headlineColor;
  ctx.textAlign = "left";

  const maxWidth = w - 120;
  const headlineLines = wrapText(ctx, headline.toUpperCase(), maxWidth);
  const headlineY = h - 280 - (headlineLines.length - 1) * 80;
  headlineLines.forEach((line, i) => {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillText(line, 63, headlineY + i * 80 + 3);
    ctx.fillStyle = colors.headlineColor;
    ctx.fillText(line, 60, headlineY + i * 80);
  });

  // Subtitle
  ctx.font = "400 32px 'DM Sans', Arial, sans-serif";
  ctx.fillStyle = colors.subtitleColor;
  const subY = headlineY + headlineLines.length * 80 + 10;
  const subtitleLines = wrapText(ctx, subtitle, maxWidth);
  subtitleLines.forEach((line, i) => {
    ctx.fillText(line, 60, subY + i * 40);
  });

  // Bottom accent line
  ctx.fillStyle = colors.brandColor;
  ctx.fillRect(60, h - 60, w - 120, 4);

  // Bottom brand tag
  ctx.font = "500 22px 'DM Sans', Arial, sans-serif";
  ctx.fillStyle = colors.subtitleColor;
  ctx.textAlign = "right";
  const handle = instagramHandle ? (instagramHandle.startsWith("@") ? instagramHandle : `@${instagramHandle}`) : "@palomitasredonditas";
  ctx.fillText(handle, w - 60, h - 28);

  return canvas.toDataURL("image/png");
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

const InstagramGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("vibrant");
  const [postType, setPostType] = useState("tip");
  const [brandName, setBrandName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostResult | null>(null);
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Escribe una descripción para tu post");
      return;
    }
    setLoading(true);
    setResult(null);
    setCompositeUrl(null);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/instagram-generator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, style, postType }),
        }
      );
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error al generar");
      }
      const data: PostResult = await resp.json();
      setResult(data);

      // Composite image with text overlay via canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const composite = renderPostToCanvas(img, data.headline, data.subtitle, style, brandName, instagramHandle);
        setCompositeUrl(composite);
      };
      img.onerror = () => {
        // If CORS fails on loading, just show raw image
        setCompositeUrl(data.imageUrl);
      };
      img.src = data.imageUrl;

      toast.success("¡Post generado! 🎉");
    } catch (e: any) {
      toast.error(e.message || "Error al generar el post");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = useCallback(() => {
    if (!result?.caption) return;
    navigator.clipboard.writeText(result.caption);
    setCopied(true);
    toast.success("Caption copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const downloadImage = useCallback(() => {
    const url = compositeUrl || result?.imageUrl;
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `palomitas-post-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagen descargada");
  }, [compositeUrl, result]);

  const currentPrompts = PROMPTS[postType] || PROMPTS.tip;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Wand2 className="w-4 h-4" />
          Generador con IA
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
          CREA POSTS PROFESIONALES
        </h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Imagen + texto con diseño profesional + caption listos para publicar
        </p>
      </div>

      {/* Post Type Selector */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 font-medium">Tipo de post:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POST_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setPostType(t.id); setPrompt(""); }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  postType === t.id
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <Icon className={`w-6 h-6 ${t.color} mb-2`} />
                <p className="font-display text-base tracking-wider text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                {postType === t.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2 font-medium">Nombre de tu marca:</p>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value.slice(0, 40))}
            placeholder="Ej: Palomitas Delicia"
            className="w-full p-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2 font-medium">Tu @ de Instagram:</p>
          <input
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 30))}
            placeholder="Ej: palomitasdelicia"
            className="w-full p-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Style selector */}
      <div>
        <p className="text-sm text-muted-foreground mb-3 font-medium">Estilo visual:</p>
        <div className="grid grid-cols-4 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                style === s.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <p className="font-display text-sm tracking-wider text-foreground mt-1">{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-medium">¿De qué trata tu post?</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: 3 tips para conservar tus palomitas frescas por más tiempo..."
          className="w-full min-h-[90px] p-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {currentPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display text-xl tracking-wider hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            CREANDO TU POST...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            GENERAR POST
          </>
        )}
      </button>

      {loading && (
        <p className="text-center text-muted-foreground text-sm animate-pulse">
          Generando imagen + texto con tipografía perfecta... ⏳
        </p>
      )}

      {/* Result */}
      {(compositeUrl || result) && (
        <div className="space-y-6 animate-fade-in">
          {/* Composite image preview */}
          <div className="relative group rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
            <img
              src={compositeUrl || result?.imageUrl}
              alt="Post de Instagram generado"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
              <button
                onClick={downloadImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display tracking-wider flex items-center gap-2 shadow-xl"
              >
                <Download className="w-5 h-5" />
                DESCARGAR
              </button>
            </div>
          </div>

          {/* Caption */}
          {result?.caption && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-lg tracking-wider text-foreground">CAPTION PARA INSTAGRAM</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Copia y pega en la descripción del post</p>
                </div>
                <button
                  onClick={copyCaption}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {result.caption}
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              DESCARGAR IMAGEN
            </button>
            <button
              onClick={() => { setResult(null); setCompositeUrl(null); setPrompt(""); }}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-display tracking-wider flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              CREAR OTRO
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default InstagramGenerator;
