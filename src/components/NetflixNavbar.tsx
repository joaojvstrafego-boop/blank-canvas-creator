import { ChefHat, Search, Bell } from "lucide-react";

const NetflixNavbar = () => {
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
        <div className="w-8 h-8 rounded bg-primary/80 flex items-center justify-center text-primary-foreground font-display text-sm">
          CV
        </div>
      </div>
    </nav>
  );
};

export default NetflixNavbar;
