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
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=5f8411e4-5bb4-42f5-8c35-53f7c6a07e8f",
      },
      {
        id: "video-obligatorio",
        title: "Clase 1 (Obligatorio ver primero)",
        description: "Clase introductoria obligatoria antes de comenzar",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=16e04a1c-dfc5-47d7-9771-d62984975436",
      },
      {
        id: "video-caramelizacion",
        title: "Caramelización (Obligatorio ver antes de las recetas)",
        description: "Aprende la técnica de caramelización antes de las recetas",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=108810d8-d425-4557-8fa2-7403643f1e81",
      },
      {
        id: "video-1",
        title: "Leche nido (en polvo)",
        description: "Receta de palomitas con leche nido",
        duration: "10 min",
        type: "video",
        thumbnail: "leche-nido",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=f50aba07-9cbd-4ed0-ada5-d0883d5af39b",
      },
      {
        id: "video-2",
        title: "Leche nido y chocolate con leche",
        description: "Combinación perfecta de leche nido con chocolate",
        duration: "12 min",
        type: "video",
        thumbnail: "leche-choco",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=de01158c-82ef-4e42-a724-4d7f9bda5f39",
      },
      {
        id: "video-3",
        title: "Trufa de chocolate",
        description: "Palomitas con trufa de chocolate irresistible",
        duration: "15 min",
        type: "video",
        thumbnail: "trufa",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=dd07aa40-e05f-43db-b24d-f15f10307256",
      },
      {
        id: "video-4",
        title: "Ovomaltine / Milo",
        description: "Sabor especial con Ovomaltine",
        duration: "10 min",
        type: "video",
        thumbnail: "ovomaltine",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=22ac5cff-8f61-45ae-a70a-cc37cbb0490c",
      },
      {
        id: "video-5",
        title: "Oreo",
        description: "Palomitas con Oreo crujiente",
        duration: "12 min",
        type: "video",
        thumbnail: "oreo",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=b46af69c-94b7-463b-9ba8-d4b3efb59ff2",
      },
      {
        id: "video-6",
        title: "Nutella",
        description: "La combinación perfecta con Nutella",
        duration: "10 min",
        type: "video",
        thumbnail: "nutella",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=3cddf72f-5079-4335-af44-5c4c66b6e249",
      },
      {
        id: "video-7",
        title: "Maní / Cacahuate",
        description: "Palomitas con maní",
        duration: "10 min",
        type: "video",
        thumbnail: "mani",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=38b76587-c67e-41ed-95dd-e1144e730508",
      },
      {
        id: "video-8",
        title: "Fresa",
        description: "Sabor fresa delicioso",
        duration: "10 min",
        type: "video",
        thumbnail: "fresa",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=9fc27788-39b0-41e6-b2c5-744a7e7a3504",
      },
      {
        id: "video-9",
        title: "Cocada / Coco",
        description: "Palomitas con coco rallado",
        duration: "10 min",
        type: "video",
        thumbnail: "coco",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=9d677964-47f6-430d-b52d-d29b06a1d128",
      },
      {
        id: "video-10",
        title: "Coco y chocolate con leche",
        description: "Coco con chocolate con leche",
        duration: "12 min",
        type: "video",
        thumbnail: "coco-choco",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=0c46cf26-86a8-40cb-a870-b66aa4b95986",
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
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=5f8411e4-5bb4-42f5-8c35-53f7c6a07e8f",
      },
      {
        id: "caramelo-intro",
        title: "Caramelización Clara Aterciopelada (Comenzar por aquí)",
        description: "Aprende la técnica de caramelización clara aterciopelada",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=bd344848-2da9-431b-a091-396b91316700",
      },
      {
        id: "caramelo-pistacho",
        title: "Palomitas de pistacho",
        description: "Palomitas con sabor a pistacho",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=a8775e90-6a55-429f-a270-7b70c00434ca",
      },
      {
        id: "caramelo-maracuya",
        title: "Palomitas de Maracuyá",
        description: "Palomitas con sabor a maracuyá",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=2aa9c949-68f7-4de8-b436-09fb141ae516",
      },
      {
        id: "caramelo-paneton",
        title: "Palomitas de panetón",
        description: "Palomitas con sabor a panetón",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=a437280b-cbd9-4e0d-9271-ed9f3ab5888e",
      },
      {
        id: "caramelo-limon",
        title: "Palomitas de tarta de limón",
        description: "Palomitas con sabor a tarta de limón",
        type: "video",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=c9f3f837-c661-49bf-a7a4-97d6b9e5ccd3",
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
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=5f8411e4-5bb4-42f5-8c35-53f7c6a07e8f",
      },
      {
        id: "agri-1",
        title: "Clase 1 (Obligatorio ver primero)",
        description: "Introducción a las recetas agridulces",
        type: "video",
        thumbnail: "intro-agridulce",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=764dd02b-91d4-4ff6-aaa6-2fb43c61de3d",
      },
      {
        id: "agri-2",
        title: "Utensilios para Palomitas Agridulces",
        description: "Los utensilios que necesitas para las recetas agridulces",
        type: "video",
        thumbnail: "utensilios",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=5635c044-d43e-4c63-a9b5-06db58c6095b",
      },
      {
        id: "agri-3",
        title: "Doritos",
        description: "Palomitas sabor Doritos",
        type: "video",
        thumbnail: "doritos",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=6fa984f2-f0b4-46e2-aa1b-7e504b1c7bb3",
      },
      {
        id: "agri-4",
        title: "Cebolla Crujiente (Crispy)",
        description: "Palomitas con cebolla crujiente",
        type: "video",
        thumbnail: "cebolla",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=fa9d5167-a9c3-4526-a221-45340f5dacf9",
      },
      {
        id: "agri-5",
        title: "Mexicana (Pimienta)",
        description: "Palomitas estilo mexicano con pimienta",
        type: "video",
        thumbnail: "mexicana",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=4e5378fd-bb90-481c-8f24-ce8d37da6670",
      },
      {
        id: "agri-6",
        title: "Papas Crujientes (Ruffles)",
        description: "Palomitas con papas crujientes estilo Ruffles",
        type: "video",
        thumbnail: "papas",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=8376c07f-1e24-4a3c-b278-5d3f272d59df",
      },
      {
        id: "agri-7",
        title: "Ajo",
        description: "Palomitas con ajo",
        type: "video",
        thumbnail: "ajo",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=9cbaee2c-5958-4229-b213-d21cff94bf43",
      },
      {
        id: "agri-8",
        title: "Lemon Pepper (Limón)",
        description: "Palomitas con limón y pimienta",
        type: "video",
        thumbnail: "lemon",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=bb8497d1-e7ec-4264-8efa-e237ca4c6415",
      },
      {
        id: "agri-9",
        title: "Queso Parmesano (Queso)",
        description: "Palomitas con queso parmesano",
        type: "video",
        thumbnail: "queso",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=fe14e04e-2352-4a7d-89ea-c6cef7e91081",
      },
      {
        id: "agri-10",
        title: "Maní (Cacahuates)",
        description: "Palomitas agridulces con maní",
        type: "video",
        thumbnail: "mani-agridulce",
        videoUrl: "https://player-vz-83f73029-e5a.tv.pandavideo.com.br/embed/?v=04554d9e-765d-49c9-b3f9-b5f3dfd4450b",
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
