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
    title: "Utensilios necesarios",
    description: "Conoce los utensilios que necesitas para preparar palomitas gourmet",
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
        id: "video-obligatorio",
        title: "Clase 1 (Obligatorio ver primero)",
        description: "Clase introductoria obligatoria antes de comenzar",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/14jtwy15RPdXSNFwL-E0p2fKCWF5gTVNT/preview",
      },
      {
        id: "video-caramelizacion",
        title: "Caramelización (Obligatorio ver antes de las recetas)",
        description: "Aprende la técnica de caramelización antes de las recetas",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/10JZh2XcIVHvXyxydnDMNBQvvvqfbFmk8/preview",
      },
      {
        id: "video-1",
        title: "Leche nido (en polvo)",
        description: "Receta de palomitas con leche nido",
        duration: "10 min",
        type: "video",
        thumbnail: "leche-nido",
        videoUrl: "https://drive.google.com/file/d/1lgyL-8qAmqjIl0udiD0-adcJWTQ5ETSN/preview",
      },
      {
        id: "video-2",
        title: "Leche nido y chocolate con leche",
        description: "Combinación perfecta de leche nido con chocolate",
        duration: "12 min",
        type: "video",
        thumbnail: "leche-choco",
        videoUrl: "https://drive.google.com/file/d/1w1dNO_ic41QTA5N2WMVDOdvPCqJbaBZs/preview",
      },
      {
        id: "video-3",
        title: "Trufa de chocolate",
        description: "Palomitas con trufa de chocolate irresistible",
        duration: "15 min",
        type: "video",
        thumbnail: "trufa",
        videoUrl: "https://drive.google.com/file/d/1H74PO3m5yOEXpzayUpCKWSqSoePoxNCY/preview",
      },
      {
        id: "video-4",
        title: "Ovomaltine / Milo",
        description: "Sabor especial con Ovomaltine",
        duration: "10 min",
        type: "video",
        thumbnail: "ovomaltine",
        videoUrl: "https://drive.google.com/file/d/1MmPq7sEGZwwZo69cPMKqiTuA-e2Zeo6B/preview",
      },
      {
        id: "video-5",
        title: "Oreo",
        description: "Palomitas con Oreo crujiente",
        duration: "12 min",
        type: "video",
        thumbnail: "oreo",
        videoUrl: "https://drive.google.com/file/d/1Nzjq0mGX_S1t1VLozedgygsaDvotGqlj/preview",
      },
      {
        id: "video-6",
        title: "Nutella",
        description: "La combinación perfecta con Nutella",
        duration: "10 min",
        type: "video",
        thumbnail: "nutella",
        videoUrl: "https://drive.google.com/file/d/1ybNGQLAvabWUoXpMEFtJGlz_Nnm3KtQb/preview",
      },
      {
        id: "video-7",
        title: "Maní / Cacahuate",
        description: "Palomitas con maní",
        duration: "10 min",
        type: "video",
        thumbnail: "mani",
        videoUrl: "https://drive.google.com/file/d/1uyVXIg5tL9sV9NO2sBVrDNWpRjARKnPE/preview",
      },
      {
        id: "video-8",
        title: "Fresa",
        description: "Sabor fresa delicioso",
        duration: "10 min",
        type: "video",
        thumbnail: "fresa",
        videoUrl: "https://drive.google.com/file/d/1PgRExc2N4e5aZHZKJrydCsRHtQvdU04l/preview",
      },
      {
        id: "video-9",
        title: "Cocada / Coco",
        description: "Palomitas con coco rallado",
        duration: "10 min",
        type: "video",
        thumbnail: "coco",
        videoUrl: "https://drive.google.com/file/d/1LZKSf6jFq2TOP8OVUYjrkGK6P0mUE2qd/preview",
      },
      {
        id: "video-10",
        title: "Coco y chocolate con leche",
        description: "Coco con chocolate con leche",
        duration: "12 min",
        type: "video",
        thumbnail: "coco-choco",
        videoUrl: "https://drive.google.com/file/d/1u2FInwMpt159rjLLUId-y2U6R1KgOENf/preview",
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
        id: "caramelo-intro",
        title: "Caramelización Clara Aterciopelada (Comenzar por aquí)",
        description: "Aprende la técnica de caramelización clara aterciopelada",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1ucPhSaWT4VoSytGQtZphXafsJ1KcRZ7q/preview",
      },
      {
        id: "caramelo-pistacho",
        title: "Palomitas de pistacho",
        description: "Palomitas con sabor a pistacho",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1PHqKNwXpR9OrvBHVcYWqz5v4o7bgc3my/preview",
      },
      {
        id: "caramelo-maracuya",
        title: "Palomitas de Maracuyá",
        description: "Palomitas con sabor a maracuyá",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1US4bOAbLbRCBogUUt8IRzDa80WKlwtW5/preview",
      },
      {
        id: "caramelo-paneton",
        title: "Palomitas de panetón",
        description: "Palomitas con sabor a panetón",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1NfwD7lCwKgxbgsoRYWXOABSxFYKc8neZ/preview",
      },
      {
        id: "caramelo-limon",
        title: "Palomitas de tarta de limón",
        description: "Palomitas con sabor a tarta de limón",
        type: "video",
        videoUrl: "https://drive.google.com/file/d/1qhzNdJugF1heB5ozasz_YgFajm2xVeVE/preview",
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
        id: "agri-1",
        title: "Clase Introductoria - Comienza Aquí",
        description: "Introducción a las recetas agridulces",
        type: "video",
        thumbnail: "intro-agridulce",
        videoUrl: "https://drive.google.com/file/d/17SspqXAvk2SFeCdLNmy-Ucp9gl66Pvov/preview",
      },
      {
        id: "agri-2",
        title: "Utensilios para Palomitas Agridulces",
        description: "Los utensilios que necesitas para las recetas agridulces",
        type: "video",
        thumbnail: "utensilios",
        videoUrl: "https://drive.google.com/file/d/1lsFj1zWBAPf1omSuL-3s2mehRLIjLu57/preview",
      },
      {
        id: "agri-3",
        title: "Doritos",
        description: "Palomitas sabor Doritos",
        type: "video",
        thumbnail: "doritos",
        videoUrl: "https://drive.google.com/file/d/1GKP03NmR8Jv2m_9IEqQw5ysIjmQzgWjy/preview",
      },
      {
        id: "agri-4",
        title: "Cebolla Crujiente (Crispy)",
        description: "Palomitas con cebolla crujiente",
        type: "video",
        thumbnail: "cebolla",
        videoUrl: "https://drive.google.com/file/d/1EXjpyyod2J93OL9uLZyw-d8p0le0CXSD/preview",
      },
      {
        id: "agri-5",
        title: "Mexicana (Pimienta)",
        description: "Palomitas estilo mexicano con pimienta",
        type: "video",
        thumbnail: "mexicana",
        videoUrl: "https://drive.google.com/file/d/1PUdqoYGfQloWKCeav6acggiFbUmD3Qq0/preview",
      },
      {
        id: "agri-6",
        title: "Papas Crujientes (Ruffles)",
        description: "Palomitas con papas crujientes estilo Ruffles",
        type: "video",
        thumbnail: "papas",
        videoUrl: "https://drive.google.com/file/d/1NK6DIvCipGa2DN8wF0hJtZtQLjBZ2ytT/preview",
      },
      {
        id: "agri-7",
        title: "Ajo",
        description: "Palomitas con ajo",
        type: "video",
        thumbnail: "ajo",
        videoUrl: "https://drive.google.com/file/d/18rg9V_wesp5mkoZVYu1WpXAUPQo_fp48/preview",
      },
      {
        id: "agri-8",
        title: "Lemon Pepper (Limón)",
        description: "Palomitas con limón y pimienta",
        type: "video",
        thumbnail: "lemon",
        videoUrl: "https://drive.google.com/file/d/1LBC3BTDjqXd6Q05rToB7crKQyh4APujw/preview",
      },
      {
        id: "agri-9",
        title: "Queso Parmesano (Queso)",
        description: "Palomitas con queso parmesano",
        type: "video",
        thumbnail: "queso",
        videoUrl: "https://drive.google.com/file/d/13R-aM95oB1I4pOJpdTSusMzzSAlk9tIv/preview",
      },
      {
        id: "agri-10",
        title: "Maní (Cacahuates)",
        description: "Palomitas agridulces con maní",
        type: "video",
        thumbnail: "mani-agridulce",
        videoUrl: "https://drive.google.com/file/d/1yjh-SwPAGUWw0PWAwHwGqsV3kWx6WuUf/preview",
      },
    ],
  },
  {
    id: "bonus-instagram",
    title: "Bonus 1 - 32 Posts Editables para Instagram",
    description: "Descarga plantillas editables para promocionar tu negocio de palomitas",
    icon: FileText,
    color: "accent",
    lessons: [
      {
        id: "bonus-publicaciones",
        title: "32 Publicaciones Editables",
        description: "Plantillas de posts profesionales para tu negocio de palomitas",
        type: "pdf",
      },
      {
        id: "bonus-leyendas",
        title: "Leyendas para tus Publicaciones",
        description: "Textos listos para copiar y pegar en tus posts de Instagram",
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
