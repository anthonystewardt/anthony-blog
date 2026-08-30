export const contentTypes = {
  ARTICLE: { label: "Artículo", icon: "✦", description: "Contenido editorial y educativo" },
  CLASS: { label: "Clase", icon: "▶", description: "Lección en video con apuntes" },
  TUTORIAL: { label: "Tutorial", icon: "</>", description: "Guía práctica paso a paso" },
  NOTE: { label: "Apunte", icon: "⌁", description: "Idea breve o referencia rápida" },
} as const;

export type ContentTypeKey = keyof typeof contentTypes;

export function getYoutubeId(url?: string | null) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return match?.[1] ?? null;
}

export function estimateReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 210));
}
