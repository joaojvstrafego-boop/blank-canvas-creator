import { useState, useEffect } from "react";
import { ChefHat, Loader2, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });
      if (error) {
        if (error.message.includes("Signups not allowed")) {
          setError("Este correo no tiene acceso. Verifica que sea el correo de tu compra.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("✅ ¡Revisa tu correo! Te enviamos un enlace para entrar.");
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

      {/* LOGIN */}
      <div className="w-full max-w-sm bg-card rounded-xl p-6 border border-border mb-4">
        <h2 className="font-display text-2xl text-center text-foreground mb-2">
          INICIAR SESIÓN
        </h2>
        <p className="text-muted-foreground text-sm text-center mb-6">
          Ingresa tu correo y te enviaremos un enlace para entrar
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
            required
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-accent text-sm">{success}</p>}
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4" /> Enviar enlace de acceso</>}
          </Button>
        </form>
      </div>

      {/* Info box */}
      <div className="w-full max-w-sm bg-card rounded-xl p-4 border border-border mb-4 text-center space-y-2">
        <p className="text-foreground text-sm font-medium">📩 Usa el correo que registraste en la compra</p>
        <p className="text-muted-foreground text-xs">Te enviaremos un enlace mágico a tu correo para entrar sin contraseña</p>
      </div>

      {/* Install App Button (Android) */}
      {deferredPrompt && (
        <Button
          onClick={handleInstall}
          variant="outline"
          className="w-full max-w-sm mb-4 gap-2"
        >
          <Download className="w-4 h-4" /> Descargar App
        </Button>
      )}

      {/* iOS Install Instructions */}
      <div className="w-full max-w-sm bg-card rounded-xl p-4 border border-border mb-8">
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
    </div>
  );
};

export default Login;
