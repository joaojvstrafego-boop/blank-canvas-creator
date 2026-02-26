import { courseFolders, type Lesson } from "@/data/courseData";
import { CheckCircle2, Circle, Clock, Download, Play } from "lucide-react";

interface FolderContentProps {
  folderId: string;
}

const LessonCard = ({ lesson, index }: { lesson: Lesson; index: number }) => {
  const getIcon = () => {
    switch (lesson.type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "pdf":
        return <Download className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {lesson.title}
          </h4>
          {lesson.completed && (
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
        {lesson.duration && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{lesson.duration}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FolderContent = ({ folderId }: FolderContentProps) => {
  const folder = courseFolders.find((f) => f.id === folderId);

  if (!folder) return null;

  const Icon = folder.icon;
  const completedCount = folder.lessons.filter((l) => l.completed).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {folder.title}
            </h2>
            <p className="text-muted-foreground">{folder.description}</p>
          </div>
        </div>
        {completedCount > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium text-foreground">
                {completedCount}/{folder.lessons.length}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${(completedCount / folder.lessons.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {folder.lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FolderContent;
