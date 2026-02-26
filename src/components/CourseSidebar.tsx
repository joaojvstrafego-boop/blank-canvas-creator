import { courseFolders } from "@/data/courseData";
import { ChefHat } from "lucide-react";

interface CourseSidebarProps {
  activeFolder: string;
  onFolderClick: (folderId: string) => void;
}

const CourseSidebar = ({ activeFolder, onFolderClick }: CourseSidebarProps) => {
  return (
    <aside className="w-72 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-sidebar-foreground">
              Palomitas
            </h2>
            <p className="text-xs text-sidebar-foreground/60">Redonditas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-3 font-semibold">
          Módulos del Curso
        </p>
        {courseFolders.map((folder) => {
          const Icon = folder.icon;
          const isActive = activeFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => onFolderClick(folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""}`} />
              <div>
                <p className="text-sm font-medium">{folder.title}</p>
                <p className="text-xs opacity-60">{folder.lessons.length} clases</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Teacher info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-display font-bold text-sm">
            CV
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Carmela Vega</p>
            <p className="text-xs text-sidebar-foreground/50">Profesora</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
