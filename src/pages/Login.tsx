import { useState, useEffect } from "react";
import { ChefHat, Loader2, ArrowLeft, Eye, EyeOff, Download } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
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
    await deferredPrompt.userChoice;
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required
                minLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
        <div className="w-full max-w-sm bg-card rounded-xl p-4 border border-border mb-4 text-center space-y-2">
          <p className="text-foreground text-sm font-medium">📩 Usa el correo que registraste en la compra</p>
          <p className="text-foreground text-sm">🔑 Tu contraseña es: <span className="font-bold text-primary">123456</span></p>
          <p className="text-muted-foreground text-xs">Si ya cambiaste tu contraseña, usa la que elegiste.</p>
          <button
            onClick={() => switchView("forgot")}
            className="text-primary text-sm underline hover:text-primary/80 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}

      {/* Install App Button */}
      {view === "login" && (
        <Button
          onClick={deferredPrompt ? handleInstall : () => {
            const iosSection = document.getElementById('ios-install');
            iosSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          variant="outline"
          className="w-full max-w-sm mb-4 gap-2"
        >
          <Download className="w-4 h-4" /> 📲 Descargar App
        </Button>
      )}

      {/* iOS Install Instructions */}
      {view === "login" && (
        <div id="ios-install" className="w-full max-w-sm bg-card rounded-xl p-4 border border-border mb-8">
          <h3 className="font-display text-base tracking-wider text-foreground mb-3 text-center">
            📱 ¿USAS iPHONE? INSTALA LA APP ASÍ:
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</span>
              <p>Abre en <span className="text-foreground font-medium">Safari</span></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</span>
              <p>Toca <span className="text-foreground font-medium">Compartir</span> ↑</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</span>
              <p><span className="text-foreground font-medium">"Agregar a inicio"</span></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">4</span>
              <p>Toca <span className="text-foreground font-medium">"Agregar"</span> 🎉</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
