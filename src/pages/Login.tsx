import { useState } from "react";
import { ChefHat, Share, PlusSquare, Download, Loader2, ArrowLeft } from "lucide-react";
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

      {/* Install Section */}
      {!isInstalled && (
        <div className="w-full max-w-sm space-y-4">
          <h3 className="font-display text-xl text-center text-foreground">
            📲 INSTALA LA APP
          </h3>

          {/* Android / Chrome — botón automático */}
          {deferredPrompt && (
            <Button
              onClick={handleInstall}
              className="w-full text-lg py-6 gap-2"
              size="lg"
            >
              <Download className="w-5 h-5" />
              Instalar App en mi celular
            </Button>
          )}

          {/* iOS — instrucciones mínimas (no hay API automática) */}
          {isIOS && !deferredPrompt && (
            <div className="bg-card rounded-xl p-5 border border-border space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                En iPhone, sigue estos 2 pasos:
              </p>
              <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-3">
                <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <p className="text-sm text-foreground">
                  Toca <Share className="w-5 h-5 inline text-primary" /> abajo de tu pantalla
                </p>
              </div>
              <div className="flex items-center gap-3 bg-primary/5 rounded-lg p-3">
                <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <p className="text-sm text-foreground">
                  Toca <PlusSquare className="w-5 h-5 inline text-primary" /> <span className="font-bold">"Agregar a inicio"</span>
                </p>
              </div>
            </div>
          )}

          {/* Ni iOS ni prompt disponible — instrucción genérica */}
          {!isIOS && !deferredPrompt && (
            <p className="text-muted-foreground text-xs text-center">
              Abre esta página en Chrome para instalar la app.
            </p>
          )}
        </div>
      )}

      {isInstalled && (
        <p className="text-accent text-sm text-center mt-4">✅ App ya instalada</p>
      )}
    </div>
  );
};

export default Login;
