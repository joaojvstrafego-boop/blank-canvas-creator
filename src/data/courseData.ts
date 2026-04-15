import { BookOpen, Calculator, FileText, ImagePlus, MessageCircle, Video } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: "video" | "pdf" | "text" | "audio";
  completed?: boolean;
  thumbnail?: string;
  videoUrl?: string;
  externalUrl?: string;
}

export interface CourseFolder {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  lessons: Lesson[];
  color: string;
}

export const courseFolders: CourseFolder[] = [
  {
    id: "utensilios",
    title: "Utensilios",
    description: "Conoce los utensilios que necesitas",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "utensilios-video",
        title: "Utensilios necesarios",
        description: "Todo lo que necesitas para comenzar",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1Q9gdY1ZIh7MWnippgnaHOzrT87CT4hOQ/preview",
      },
    ],
  },
  {
    id: "tipos-maiz",
    title: "Tipos de maíz",
    description: "Aprende sobre los diferentes tipos de maíz para palomitas",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "tipos-maiz-video",
        title: "Tipos de maíz",
        description: "Conoce las variedades de maíz ideales",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1l59-3H6Zz9wdWaUUoNcBf1fVPqp4zgIJ/preview",
      },
    ],
  },
  {
    id: "tipos-chocolate",
    title: "Tipos de chocolate",
    description: "Descubre los mejores chocolates para tus palomitas",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "tipos-chocolate-video",
        title: "Tipos de chocolate",
        description: "Guía completa de chocolates para palomitas",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1K75nR7SsIlBkPtweFpOeuPO10gmtGrC9/preview",
      },
    ],
  },
  {
    id: "conservar-palomitas",
    title: "Cómo conservar",
    description: "Aprende a conservar tus palomitas correctamente",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "conservar-video",
        title: "Cómo conservar",
        description: "Tips para mantener tus palomitas frescas",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1xpJz1frFs_fcvhclTHbXBL9fAwZyG1Ur/preview",
      },
    ],
  },
  {
    id: "receitas-pdf",
    title: "Recetas en PDF",
    description: "Descarga las recetas completas en formato PDF",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "pdf-1",
        title: "Recetas Completas",
        description: "Todas las recetas de palomitas gourmet en un solo PDF",
        type: "pdf",
        thumbnail: "classicas",
      },
    ],
  },
  {
    id: "receitas-video",
    title: "Palomitas Dulces con Caramelo Tradicional",
    description: "Sigue el paso a paso con Carmela",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "video-estallido-dulce",
        title: "Estallido de las palomitas",
        description: "Aprende cómo estallan las palomitas correctamente",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/P_FhhHt3XBI?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-obligatorio",
        title: "Clase 1 (Obligatorio ver primero)",
        description: "Clase introductoria obligatoria antes de comenzar",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/CqH8_k6cE24?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-caramelizacion",
        title: "Caramelización (Obligatorio ver antes de las recetas)",
        description: "Aprende la técnica de caramelización antes de las recetas",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/EVEG1mjL8ug?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-1",
        title: "Leche nido (en polvo)",
        description: "Receta de palomitas con leche nido",
        duration: "10 min",
        type: "video",
        thumbnail: "leche-nido",
        videoUrl: "https://www.youtube.com/embed/es7rwsbtr5k?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-2",
        title: "Leche nido y chocolate con leche",
        description: "Combinación perfecta de leche nido con chocolate",
        duration: "12 min",
        type: "video",
        thumbnail: "leche-choco",
        videoUrl: "https://www.youtube.com/embed/XRNGYuIa29M?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-3",
        title: "Trufa de chocolate",
        description: "Palomitas con trufa de chocolate irresistible",
        duration: "15 min",
        type: "video",
        thumbnail: "trufa",
        videoUrl: "https://www.youtube.com/embed/UUgHrrEd22s?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-4",
        title: "Ovomaltine / Milo",
        description: "Sabor especial con Ovomaltine",
        duration: "10 min",
        type: "video",
        thumbnail: "ovomaltine",
        videoUrl: "https://www.youtube.com/embed/eQnhg9Vr5pk?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-5",
        title: "Oreo",
        description: "Palomitas con Oreo crujiente",
        duration: "12 min",
        type: "video",
        thumbnail: "oreo",
        videoUrl: "https://www.youtube.com/embed/09CZk4RzBWI?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-6",
        title: "Nutella",
        description: "La combinación perfecta con Nutella",
        duration: "10 min",
        type: "video",
        thumbnail: "nutella",
        videoUrl: "https://www.youtube.com/embed/VAxsVEXQwqw?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-7",
        title: "Maní / Cacahuate",
        description: "Palomitas con maní",
        duration: "10 min",
        type: "video",
        thumbnail: "mani",
        videoUrl: "https://www.youtube.com/embed/RIOUhIxaQxw?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-8",
        title: "Fresa",
        description: "Sabor fresa delicioso",
        duration: "10 min",
        type: "video",
        thumbnail: "fresa",
        videoUrl: "https://www.youtube.com/embed/wzPgqv0zXtY?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-9",
        title: "Cocada / Coco",
        description: "Palomitas con coco rallado",
        duration: "10 min",
        type: "video",
        thumbnail: "coco",
        videoUrl: "https://www.youtube.com/embed/ZRozIjY1fko?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "video-10",
        title: "Coco y chocolate con leche",
        description: "Coco con chocolate con leche",
        duration: "12 min",
        type: "video",
        thumbnail: "coco-choco",
        videoUrl: "https://www.youtube.com/embed/S4QtrYpfpjQ?modestbranding=1&rel=0&showinfo=0",
      },
    ],
  },
  {
    id: "caramelo-aterciopelado",
    title: "Palomitas Dulces con Caramelo Aterciopelado",
    description: "Recetas con caramelo aterciopelado paso a paso",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "video-estallido-aterciopelado",
        title: "Estallido de las palomitas",
        description: "Aprende cómo estallan las palomitas correctamente",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/P_FhhHt3XBI?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "caramelo-intro",
        title: "Caramelización Clara Aterciopelada (Comenzar por aquí)",
        description: "Aprende la técnica de caramelización clara aterciopelada",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/kV6ztb_UDzU?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "caramelo-pistacho",
        title: "Palomitas de pistacho",
        description: "Palomitas con sabor a pistacho",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/tFjt3qCR86A?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "caramelo-maracuya",
        title: "Palomitas de Maracuyá",
        description: "Palomitas con sabor a maracuyá",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/2b2hPmHLw-o?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "caramelo-paneton",
        title: "Palomitas de panetón",
        description: "Palomitas con sabor a panetón",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/3WDCyqobxcA?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "caramelo-limon",
        title: "Palomitas de tarta de limón",
        description: "Palomitas con sabor a tarta de limón",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/J0z0ut7w-TI?modestbranding=1&rel=0&showinfo=0",
      },
    ],
  },
  {
    id: "receitas-agridulces",
    title: "Palomitas Agridulces (Saladas)",
    description: "Aprende a preparar palomitas agridulces paso a paso",
    icon: Video,
    color: "primary",
    lessons: [
      {
        id: "video-estallido-agridulce",
        title: "Estallido de las palomitas",
        description: "Aprende cómo estallan las palomitas correctamente",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/P_FhhHt3XBI?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-1",
        title: "Clase 1 (Obligatorio ver primero)",
        description: "Introducción a las recetas agridulces",
        type: "video",
        thumbnail: "intro-agridulce",
        videoUrl: "https://www.youtube.com/embed/F0NLHL-Gs_8?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-2",
        title: "Utensilios para Palomitas Agridulces",
        description: "Los utensilios que necesitas para las recetas agridulces",
        type: "video",
        thumbnail: "utensilios",
        videoUrl: "https://www.youtube.com/embed/0X5cE8pzPw8?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-3",
        title: "Doritos",
        description: "Palomitas sabor Doritos",
        type: "video",
        thumbnail: "doritos",
        videoUrl: "https://www.youtube.com/embed/TxRuNZQW3uc?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-4",
        title: "Cebolla Crujiente (Crispy)",
        description: "Palomitas con cebolla crujiente",
        type: "video",
        thumbnail: "cebolla",
        videoUrl: "https://www.youtube.com/embed/L5pFuNHEG-M?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-5",
        title: "Mexicana (Pimienta)",
        description: "Palomitas estilo mexicano con pimienta",
        type: "video",
        thumbnail: "mexicana",
        videoUrl: "https://www.youtube.com/embed/ij3KqRl4-60?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-6",
        title: "Papas Crujientes (Ruffles)",
        description: "Palomitas con papas crujientes estilo Ruffles",
        type: "video",
        thumbnail: "papas",
        videoUrl: "https://www.youtube.com/embed/Lcdj88tZGKU?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-7",
        title: "Ajo",
        description: "Palomitas con ajo",
        type: "video",
        thumbnail: "ajo",
        videoUrl: "https://www.youtube.com/embed/k_gqQAiAAPw?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-8",
        title: "Lemon Pepper (Limón)",
        description: "Palomitas con limón y pimienta",
        type: "video",
        thumbnail: "lemon",
        videoUrl: "https://www.youtube.com/embed/XI5yCcQf6ug?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-9",
        title: "Queso Parmesano (Queso)",
        description: "Palomitas con queso parmesano",
        type: "video",
        thumbnail: "queso",
        videoUrl: "https://www.youtube.com/embed/LUQ7XNEDJLw?modestbranding=1&rel=0&showinfo=0",
      },
      {
        id: "agri-10",
        title: "Maní (Cacahuates)",
        description: "Palomitas agridulces con maní",
        type: "video",
        thumbnail: "mani-agridulce",
        videoUrl: "https://www.youtube.com/embed/KjxhqHB51WE?modestbranding=1&rel=0&showinfo=0",
      },
    ],
  },
  {
    id: "bonus-instagram",
    title: "32 Posts Editables para Instagram",
    description: "Descarga plantillas editables para promocionar tu negocio de palomitas",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "bonus-publicaciones",
        title: "32 Publicaciones Editables",
        description: "Plantillas de posts profesionales para tu negocio de palomitas",
        type: "pdf",
        externalUrl: "https://www.canva.com/design/DAHCPTbGaIs/fKQP77OUC2QHEQ0aEC76ug/view?utm_content=DAHCPTbGaIs&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview",
      },
      {
        id: "bonus-leyendas",
        title: "Leyendas para tus Publicaciones",
        description: "Textos listos para copiar y pegar en tus posts de Instagram",
        type: "pdf",
        externalUrl: "https://www.canva.com/design/DAHCPfoLPbg/2bt41U5Bbkpq2-S6vKP3bQ/view?utm_content=DAHCPfoLPbg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview",
      },
    ],
  },
  {
    id: "bonus-recetas-alternativas",
    title: "Recetas Alternativas",
    description: "Recetas alternativas en PDF para expandir tu menú de palomitas",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "bonus-recetas-alt-pdf",
        title: "Recetas Alternativas",
        description: "PDF con recetas alternativas para tu negocio de palomitas",
        type: "pdf",
      },
    ],
  },
  {
    id: "calculadora",
    title: "Calculadora",
    description: "Calcula el precio de tus palomitas",
    icon: Calculator,
    color: "accent",
    lessons: [
      {
        id: "calc-1",
        title: "Calculadora de Precios",
        description: "Herramienta para calcular el precio ideal de tus palomitas",
        type: "text",
      },
    ],
  },
  {
    id: "instagram-ai",
    title: "Generador IA para Instagram",
    description: "Crea imágenes y captions profesionales con inteligencia artificial",
    icon: ImagePlus,
    color: "accent",
    lessons: [
      {
        id: "ig-generator",
        title: "Generador de Imágenes IA",
        description: "Crea posts increíbles para tu negocio de palomitas",
        type: "text",
      },
    ],
  },
  {
    id: "orcamentos",
    title: "Generador de Presupuestos",
    description: "Crea presupuestos profesionales en PDF para tus clientes",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "orcamento-gen",
        title: "Generador de Presupuestos",
        description: "Crea y descarga presupuestos personalizados con tu marca",
        type: "text",
      },
    ],
  },
  {
    id: "soporte",
    title: "Soporte",
    description: "Pregúntale a Carmela IA sobre palomitas gourmet",
    icon: MessageCircle,
    color: "primary",
    lessons: [
      {
        id: "soporte-chat",
        title: "Chat con Carmela IA",
        description: "Asistente virtual experta en palomitas gourmet",
        type: "text",
      },
    ],
  },
];
