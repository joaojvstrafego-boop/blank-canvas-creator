import { useState } from "react";
import { ChefHat, Download, Loader2, ArrowLeft } from "lucide-react";
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

  useState(() => {
    // Detect iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Detect if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Capture install prompt for Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  });

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
              minLength={6}
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

      {/* Toggle login/signup */}
      {view === "login" && (
        <div className="w-full max-w-sm bg-card/50 rounded-xl p-4 border border-border mb-8 text-center space-y-3">
          <p className="text-muted-foreground text-sm">¿No tienes cuenta o olvidaste tu contraseña?</p>
          <Button variant="outline" className="w-full" onClick={() => switchView("signup")}>
            Crear cuenta
          </Button>
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
            variant="outline"
            className="w-full text-base py-5 gap-2"
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
    </div>
  );
};

export default Login;
