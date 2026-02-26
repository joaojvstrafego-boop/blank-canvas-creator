import { courseFolders } from "@/data/courseData";
import { ChefHat, Menu, X } from "lucide-react";
import { useState } from "react";

interface MobileSidebarProps {
  activeFolder: string;
  onFolderClick: (folderId: string) => void;
}

const MobileSidebar = ({ activeFolder, onFolderClick }: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (id: string) => {
    onFolderClick(id);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display font-bold">Palomitas Redonditas</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-sidebar text-sidebar-foreground p-4 border-b border-sidebar-border space-y-1">
          {courseFolders.map((folder) => {
            const Icon = folder.icon;
            const isActive = activeFolder === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => handleClick(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""}`} />
                <span className="text-sm font-medium">{folder.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
