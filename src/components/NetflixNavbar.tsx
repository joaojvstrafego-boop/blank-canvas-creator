import { useState } from "react";
import { ChefHat, Search, Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NetflixNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 flex items-center justify-between bg-gradient-to-b from-background via-background/80 to-transparent">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl tracking-wider text-foreground">
            PALOMITAS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded bg-primary/80 flex items-center justify-center text-primary-foreground font-display text-sm"
          >
            CV
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[140px]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NetflixNavbar;
