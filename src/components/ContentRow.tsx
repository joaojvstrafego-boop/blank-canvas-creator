import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Download, CheckCircle2, Clock } from "lucide-react";
import type { Lesson } from "@/data/courseData";

// Thumbnail imports
import thumbClassicas from "@/assets/thumb-classicas.jpg";
import thumbChocolate from "@/assets/thumb-chocolate.jpg";
import thumbCaramelo from "@/assets/thumb-caramelo.jpg";
import thumbSalgadas from "@/assets/thumb-salgadas.jpg";
import thumbDecoracao from "@/assets/thumb-decoracao.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

const thumbnailMap: Record<string, string> = {
  classicas: thumbClassicas,
  chocolate: thumbChocolate,
  caramelo: thumbCaramelo,
  salgadas: thumbSalgadas,
  decoracao: thumbDecoracao,
  "intro-welcome": heroBanner,
  "intro-materials": thumbClassicas,
  "intro-tips": thumbChocolate,
};

interface ContentRowProps {
  title: string;
  lessons: Lesson[];
}

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  const thumb = lesson.thumbnail ? thumbnailMap[lesson.thumbnail] : heroBanner;

  return (
    <div className="group relative flex-shrink-0 w-[240px] md:w-[280px] cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-md overflow-hidden bg-card mb-2">
        <img
          src={thumb}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {lesson.type === "pdf" ? (
              <Download className="w-10 h-10 text-foreground drop-shadow-lg" />
            ) : (
              <Play className="w-12 h-12 text-foreground fill-foreground drop-shadow-lg" />
            )}
          </div>
        </div>
        {/* Duration badge */}
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
        {/* Completed badge */}
        {lesson.completed && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {lesson.title}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
        {lesson.description}
      </p>
    </div>
  );
};

const ContentRow = ({ title, lessons }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10">
      <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground px-4 md:px-12 mb-3">
        {title}
      </h3>

      <div className="group/row relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-8 z-10 w-10 bg-gradient-to-r from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex gap-3 px-4 md:px-12 overflow-x-auto scrollbar-hide"
        >
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-8 z-10 w-10 bg-gradient-to-l from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
