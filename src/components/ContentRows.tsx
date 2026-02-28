import { useState, useRef, lazy, Suspense } from "react";
import { ChevronLeft, ChevronRight, Play, Download, CheckCircle2, Clock, ArrowLeft, X, FileText, ExternalLink, Volume2, MessageCircle, ImagePlus } from "lucide-react";
import { courseFolders, type CourseFolder, type Lesson } from "@/data/courseData";

import coverEmpieza from "@/assets/cover-empieza.jpg";
import coverPdfReal from "@/assets/cover-pdf-real.jpg";
import coverVideo from "@/assets/cover-receitas-doces.png";
import coverCalculadora from "@/assets/cover-calculadora.jpg";
import coverOrcamentos from "@/assets/cover-orcamentos.png";
import coverAgridulces from "@/assets/cover-agridulces.jpg";
import coverBonusInstagram from "@/assets/cover-bonus-instagram.jpg";
import coverInstagramAI from "@/assets/cover-instagram-ai.png";
import coverSoporte from "@/assets/cover-soporte.jpg";

const SupportChat = lazy(() => import("@/components/SupportChat"));
const InstagramGenerator = lazy(() => import("@/components/InstagramGenerator"));
const BudgetGenerator = lazy(() => import("@/components/BudgetGenerator"));

import thumbClassicas from "@/assets/thumb-classicas.jpg";
import thumbChocolate from "@/assets/thumb-chocolate.jpg";
import thumbCaramelo from "@/assets/thumb-caramelo.jpg";
import thumbSalgadas from "@/assets/thumb-salgadas.jpg";
import thumbDecoracao from "@/assets/thumb-decoracao.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import thumbLecheNido from "@/assets/thumb-leche-nido.jpg";
import thumbLecheChoco from "@/assets/thumb-leche-choco.jpg";
import thumbTrufa from "@/assets/thumb-trufa.jpg";
import thumbOvomaltine from "@/assets/thumb-ovomaltine.jpg";
import thumbOreo from "@/assets/thumb-oreo.jpg";
import thumbNutella from "@/assets/thumb-nutella.jpg";
import thumbMani from "@/assets/thumb-mani.jpg";
import thumbFresa from "@/assets/thumb-fresa.jpg";
import thumbCoco from "@/assets/thumb-coco.jpg";
import thumbCocoChoco from "@/assets/thumb-coco-choco.jpg";
import thumbDoritos from "@/assets/thumb-doritos.jpg";
import thumbCebolla from "@/assets/thumb-cebolla.jpg";
import thumbMexicana from "@/assets/thumb-mexicana.jpg";
import thumbPapas from "@/assets/thumb-papas.jpg";
import thumbAjo from "@/assets/thumb-ajo.jpg";
import thumbLemon from "@/assets/thumb-lemon.jpg";
import thumbQueso from "@/assets/thumb-queso.jpg";
import thumbManiAgridulce from "@/assets/thumb-mani-agridulce.jpg";
import thumbUtensilios from "@/assets/thumb-utensilios.jpg";
import thumbIntroAgridulce from "@/assets/thumb-intro-agridulce.jpg";

const folderCovers: Record<string, string> = {
  introducao: coverEmpieza,
  "receitas-pdf": coverPdfReal,
  "receitas-video": coverVideo,
  calculadora: coverCalculadora,
  "receitas-agridulces": coverAgridulces,
  "bonus-instagram": coverBonusInstagram,
  "instagram-ai": coverInstagramAI,
  orcamentos: coverOrcamentos,
  soporte: coverSoporte,
};

const thumbnailMap: Record<string, string> = {
  classicas: thumbClassicas,
  chocolate: thumbChocolate,
  caramelo: thumbCaramelo,
  salgadas: thumbSalgadas,
  decoracao: thumbDecoracao,
  "intro-welcome": heroBanner,
  "intro-materials": thumbClassicas,
  "intro-tips": thumbChocolate,
  "leche-nido": thumbLecheNido,
  "leche-choco": thumbLecheChoco,
  trufa: thumbTrufa,
  ovomaltine: thumbOvomaltine,
  oreo: thumbOreo,
  nutella: thumbNutella,
  mani: thumbMani,
  fresa: thumbFresa,
  coco: thumbCoco,
  "coco-choco": thumbCocoChoco,
  doritos: thumbDoritos,
  cebolla: thumbCebolla,
  mexicana: thumbMexicana,
  papas: thumbPapas,
  ajo: thumbAjo,
  lemon: thumbLemon,
  queso: thumbQueso,
  "mani-agridulce": thumbManiAgridulce,
  utensilios: thumbUtensilios,
  "intro-agridulce": thumbIntroAgridulce,
};

const DRIVE_FILE_IDS: Record<string, string> = {
  "PALOMITAS_REDONDITAS.pdf": "1N4D9Ff0KhVyjJZkNkxJGuJGVTGAHfsWr",
  "publicaciones.pdf": "1V7NyK8AnSscvZ-mocxpcM6OooxUdXZMP",
  "leyendas.pdf": "1JRv330ldOVDMjWv4uxz8-NwK-rz80AkD",
};

const SUPABASE_STORAGE_BASE = "https://gzunvwllnrykwaqtiqhj.supabase.co/storage/v1/object/public/course-files";

const pdfResources: Record<string, { file: string; name: string }> = {
  "pdf-1": { file: "PALOMITAS_REDONDITAS.pdf", name: "PALOMITAS_REDONDITAS.pdf" },
  "bonus-publicaciones": { file: "publicaciones.pdf", name: "publicaciones.pdf" },
  "bonus-leyendas": { file: "leyendas.pdf", name: "leyendas.pdf" },
};

const AUDIO_URL = "/audio-intro.mp3";

const getPdfResource = (lessonId: string) => pdfResources[lessonId] || pdfResources["pdf-1"];

// Use Google Drive when available, otherwise Supabase Storage
const getDrivePreviewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;
const getDriveDownloadUrl = (fileId: string) => `https://drive.google.com/uc?export=download&id=${fileId}`;
const getDriveViewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/view`;

const getViewUrl = (fileName: string) => {
  const driveId = DRIVE_FILE_IDS[fileName];
  if (driveId) return getDrivePreviewUrl(driveId);
  return `${SUPABASE_STORAGE_BASE}/${fileName}`;
};

const getDownloadUrl = (fileName: string) => {
  const driveId = DRIVE_FILE_IDS[fileName];
  if (driveId) return getDriveDownloadUrl(driveId);
  return `${SUPABASE_STORAGE_BASE}/${fileName}?download=`;
};

const getOpenUrl = (fileName: string) => {
  const driveId = DRIVE_FILE_IDS[fileName];
  if (driveId) return getDriveViewUrl(driveId);
  return `${SUPABASE_STORAGE_BASE}/${fileName}`;
};

// --- Folder Card (poster style) ---
const FolderCard = ({ folder, onClick }: { folder: CourseFolder; onClick: () => void }) => {
  const cover = folderCovers[folder.id] || heroBanner;

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-[180px] md:w-[220px] cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-card">
        <img
          src={cover}
          alt={folder.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="font-display text-lg tracking-wider text-foreground">
            {folder.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {folder.lessons.length} clases
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            {folder.id === "soporte" ? (
              <MessageCircle className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
            ) : folder.id === "instagram-ai" ? (
              <ImagePlus className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Lesson Card (inside folder view) ---
const LessonCard = ({ lesson, onPlay }: { lesson: Lesson; onPlay: (lesson: Lesson) => void }) => {
  const thumb = lesson.thumbnail ? thumbnailMap[lesson.thumbnail] : heroBanner;

  return (
    <div
      className="group relative flex-shrink-0 w-[240px] md:w-[280px] cursor-pointer"
      onClick={() => onPlay(lesson)}
    >
      <div className="relative aspect-video rounded-md overflow-hidden bg-card mb-2">
        <img
          src={thumb}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {lesson.type === "pdf" ? (
              <Download className="w-10 h-10 text-foreground drop-shadow-lg" />
            ) : lesson.type === "audio" ? (
              <Volume2 className="w-10 h-10 text-foreground drop-shadow-lg" />
            ) : (
              <Play className="w-12 h-12 text-foreground fill-foreground drop-shadow-lg" />
            )}
          </div>
        </div>
        {lesson.duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
        {lesson.completed && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {lesson.title}
      </h4>
      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
        {lesson.description}
      </p>
    </div>
  );
};

// --- Video Player Modal ---
const VideoPlayer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={onClose}>
    <div className="w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">{lesson.title}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={lesson.videoUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={lesson.title}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-3">{lesson.description}</p>
    </div>
  </div>
);

// --- Audio Player Modal ---
const AudioPlayer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center" onClick={onClose}>
    <div className="w-full max-w-lg px-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">{lesson.title}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Volume2 className="w-10 h-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center">{lesson.description}</p>
        <audio controls autoPlay className="w-full" src={AUDIO_URL}>
          Tu navegador no soporta audio.
        </audio>
      </div>
    </div>
  </div>
);

// --- PDF Viewer Modal ---
const PdfViewer = ({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) => {
  const pdf = getPdfResource(lesson.id);
  const pdfFileName = pdf.file;
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Volver al menú</span>
          </button>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="font-display text-base md:text-lg tracking-wider text-foreground">{lesson.title}</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 w-full flex flex-col">
        <div className="flex items-center justify-end gap-2 px-4 py-2 shrink-0">
          <a
            href={getDownloadUrl(pdfFileName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar
          </a>
          <a
            href={getOpenUrl(pdfFileName)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir
          </a>
        </div>
        <div className="flex-1 min-h-[70vh] md:min-h-0">
          <iframe
            src={getViewUrl(pdfFileName)}
            className="w-full h-full border-0 rounded-lg"
            title={lesson.title}
            allow="autoplay"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

// --- Scrollable Row ---
const ScrollRow = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Swipe hint for mobile */}
      <div className="flex items-center gap-2 px-4 md:px-12 mb-3 md:hidden">
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Desliza para ver más</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="group/row relative">
        {/* Left arrow - always visible when scrolled */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center justify-center transition-opacity ${showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center shadow-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 px-4 md:px-12 overflow-x-auto scrollbar-hide"
          onScroll={updateArrows}
        >
          {children}
        </div>

        {/* Right arrow - visible by default to hint there's more */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center transition-opacity ${showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center shadow-lg animate-pulse">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </div>
        </button>
      </div>
    </div>
  );
};

// --- Folder Inside View (full screen replacement) ---
const FolderView = ({
  folder,
  onBack,
  onPlayLesson,
}: {
  folder: CourseFolder;
  onBack: () => void;
  onPlayLesson: (lesson: Lesson) => void;
}) => {
  const cover = folderCovers[folder.id] || heroBanner;
  const isAudioFolder = folder.lessons.every((l) => l.type === "audio");
  const isCalculadora = folder.id === "calculadora";
  const isPdfFolder = folder.id === "receitas-pdf";
  const isBonusFolder = folder.id === "bonus-instagram";
  const isSoporte = folder.id === "soporte";
  const isInstagramAI = folder.id === "instagram-ai";
  const isOrcamentos = folder.id === "orcamentos";
  return (
    <div className="animate-fade-in pb-16">
      {/* Hero banner for folder */}
      <div className="relative h-[200px] md:h-[280px] mb-6">
        <img src={cover} alt={folder.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">← Volver al menú</span>
          </button>
          <h2 className="font-display text-2xl md:text-4xl tracking-wider text-foreground">
            {folder.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {folder.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12">
        {isSoporte ? (
          <Suspense fallback={<div className="text-center text-muted-foreground py-8">Cargando...</div>}>
            <SupportChat />
          </Suspense>
        ) : isInstagramAI ? (
          <Suspense fallback={<div className="text-center text-muted-foreground py-8">Cargando...</div>}>
            <InstagramGenerator />
          </Suspense>
        ) : isOrcamentos ? (
          <Suspense fallback={<div className="text-center text-muted-foreground py-8">Cargando...</div>}>
            <BudgetGenerator />
          </Suspense>
        ) : isCalculadora ? (
          /* Calculator embedded directly */
          <div className="w-full max-w-5xl mx-auto">
            <iframe
              src="https://dulce-pop-calculadora.lovable.app"
              className="w-full h-[70vh] rounded-lg border border-border"
              title="Calculadora de Precios"
              allowFullScreen
            />
          </div>
        ) : isPdfFolder ? (
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
              <a
                href={getDownloadUrl("PALOMITAS_REDONDITAS.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Descargar PDF
              </a>
              <a
                href={getOpenUrl("PALOMITAS_REDONDITAS.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Abrir en navegador
              </a>
            </div>
            <iframe
              src={getViewUrl("PALOMITAS_REDONDITAS.pdf")}
              className="w-full h-[70vh] rounded-lg border border-border"
              title="Recetas en PDF"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        ) : isBonusFolder ? (
          /* Bonus folder - show PDF lessons as downloadable cards */
          <div className="max-w-3xl mx-auto space-y-4">
            {folder.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => onPlayLesson(lesson)}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg tracking-wider text-foreground">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                </div>
                <Download className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : isAudioFolder ? (
          /* Audio inline player */
          <div className="max-w-2xl mx-auto space-y-6">
            {folder.lessons.map((lesson) => (
              <div key={lesson.id} className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Volume2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg md:text-xl tracking-wider text-foreground">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                  </div>
                </div>
                <audio controls className="w-full" src={AUDIO_URL}>
                  Tu navegador no soporta audio.
                </audio>
              </div>
            ))}
          </div>
        ) : (
          /* Normal lessons grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folder.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="group cursor-pointer"
                onClick={() => onPlayLesson(lesson)}
              >
                <div className="relative aspect-video rounded-md overflow-hidden bg-card mb-2">
                  <img
                    src={lesson.thumbnail ? thumbnailMap[lesson.thumbnail] : heroBanner}
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {lesson.type === "pdf" ? (
                        <FileText className="w-8 h-8 text-foreground drop-shadow-lg" />
                      ) : (
                        <Play className="w-10 h-10 text-foreground fill-foreground drop-shadow-lg" />
                      )}
                    </div>
                  </div>
                  {lesson.duration && (
                    <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">
                      <Clock className="w-2.5 h-2.5" />
                      {lesson.duration}
                    </div>
                  )}
                  {lesson.completed && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {lesson.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {lesson.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Content Section ---
const ContentRows = () => {
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<Lesson | null>(null);

  const activeFolder = openFolder ? courseFolders.find((f) => f.id === openFolder) : null;

  // If a folder is open, show full-screen folder view
  if (activeFolder) {
    return (
      <>
        <FolderView
          folder={activeFolder}
          onBack={() => setOpenFolder(null)}
          onPlayLesson={setPlayingLesson}
        />

        {/* PDF viewer */}
        {playingLesson?.type === "pdf" && (
          <PdfViewer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}

        {/* Audio player */}
        {playingLesson?.type === "audio" && (
          <AudioPlayer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}

        {/* Video player */}
        {playingLesson?.videoUrl && playingLesson?.id !== "calc-1" && (
          <VideoPlayer lesson={playingLesson} onClose={() => setPlayingLesson(null)} />
        )}
      </>
    );
  }

  return (
    <div className="-mt-16 relative z-10 pb-16">
      {/* Folder covers row */}
      <div className="mb-10">
        <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground px-4 md:px-12 mb-3">
          MÓDULOS DEL CURSO
        </h3>
        <ScrollRow>
          {courseFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => setOpenFolder(folder.id)}
            />
          ))}
        </ScrollRow>
      </div>
    </div>
  );
};

export default ContentRows;
