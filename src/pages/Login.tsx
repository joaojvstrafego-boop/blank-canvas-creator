import { useEffect, useState } from "react";
import { ChefHat, Download, Loader2, ArrowLeft, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type View = "login" | "signup" | "forgot";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<View>("login");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Detect if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Capture install prompt for Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const switchView = (v: View) => {
    setView(v);
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Correo o contraseña incorrectos.");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes("already registered")) {
          // Try to sign in instead
          const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          if (loginError) {
            setError("Este correo ya está registrado. Verifica tu contraseña o recupera tu contraseña.");
          }
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("¡Cuenta creada! Ya puedes acceder al curso.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("¡Listo! Revisa tu correo para restablecer tu contraseña.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-display text-4xl tracking-wider text-foreground">
          PALOMITAS
        </span>
      </div>

      {/* ====== LOGIN ====== */}
      {view === "login" && (
        <div className="w-full max-w-sm bg-card rounded-xl p-6 border border-border mb-4">
          <h2 className="font-display text-2xl text-center text-foreground mb-6">
            INICIAR SESIÓN
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              minLength={4}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </div>
      )}

      {/* ====== SIGNUP ====== */}
      {view === "signup" && (
        <div className="w-full max-w-sm bg-card rounded-xl p-6 border border-border mb-4">
          <button
            onClick={() => switchView("login")}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h2 className="font-display text-2xl text-center text-foreground mb-2">
            CREAR CUENTA
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Crea tu cuenta para acceder al curso
          </p>
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Crea una contraseña (mínimo 6 caracteres)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              minLength={6}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-accent text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear mi cuenta"}
            </Button>
          </form>
        </div>
      )}

      {/* ====== FORGOT PASSWORD ====== */}
      {view === "forgot" && (
        <div className="w-full max-w-sm bg-card rounded-xl p-6 border border-border mb-4">
          <button
            onClick={() => switchView("login")}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h2 className="font-display text-2xl text-center text-foreground mb-2">
            RECUPERAR CONTRASEÑA
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
          <form onSubmit={handleForgot} className="space-y-4">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            {success && <p className="text-accent text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar enlace"}
            </Button>
          </form>
        </div>
      )}

      {/* Info box */}
      {view === "login" && (
        <div className="w-full max-w-sm bg-card rounded-xl p-4 border border-border mb-8 text-center space-y-2">
          <p className="text-foreground text-sm font-medium">📩 Usa el correo que registraste en la compra</p>
          <p className="text-muted-foreground text-sm">🔑 Tu contraseña es: <span className="font-bold text-foreground">1234</span></p>
          <button
            onClick={() => switchView("forgot")}
            className="text-primary text-sm underline hover:text-primary/80 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}

      {/* Install Button */}
      {!isInstalled && (
        <div className="w-full max-w-sm mt-6">
          <Button
            onClick={() => {
              if (deferredPrompt) {
                handleInstall();
              } else {
                alert(
                  "📲 Para instalar o app:\n\n" +
                  (isIOS
                    ? "1️⃣ Abra no Safari\n2️⃣ Aperta no ícone de compartilhar ⬆️ (embaixo da tela)\n3️⃣ Aperta em \"Tela de Início\""
                    : "1️⃣ Abra no Chrome\n2️⃣ Aperta nos 3 pontinhos ⋮ (canto de cima)\n3️⃣ Aperta em \"Instalar aplicativo\"")
                );
              }
            }}
            variant="default"
            className="w-full text-base py-5 gap-2 font-bold bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-accent/50 animate-pulse"
            size="lg"
          >
            <Download className="w-5 h-5" />
            📲 Instalar App no celular
          </Button>
        </div>
      )}

      {isInstalled && (
        <p className="text-accent text-sm text-center mt-4">✅ App instalado</p>
      )}

      {/* iOS Step-by-step guide */}
      {!isInstalled && (
        <div className="w-full max-w-sm mt-8 space-y-4 bg-card rounded-xl p-4 border border-border">
          <h3 className="font-display text-xl text-center text-foreground">
            📲 CÓMO INSTALAR EN iPHONE
          </h3>
          <p className="text-muted-foreground text-sm text-center">
            Sigue estos pasos para instalar la app en tu iPhone:
          </p>
          <div className="space-y-1">
            {[
              { src: "/images/ios-step1.webp", label: "Paso 1: Abre los 3 puntitos ⋯" },
              { src: "/images/ios-step2.webp", label: "Paso 2: Toca \"Compartir\"" },
              { src: "/images/ios-step3.webp", label: "Paso 3: Toca \"Ver más\"" },
              { src: "/images/ios-step4.webp", label: "Paso 4: Toca \"Agregar a Inicio\"" },
              { src: "/images/ios-step5.webp", label: "Paso 5: ¡Listo! Ya está en tu celular" },
            ].map((step, i, arr) => (
              <div key={i}>
                <div className="rounded-lg border border-border overflow-hidden bg-muted">
                  <p className="text-sm font-semibold text-foreground bg-card px-3 py-2">{step.label}</p>
                  <img src={step.src} alt={step.label} className="w-full" loading="lazy" />
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
