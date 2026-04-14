import es from "../../messages/es.json";
import en from "../../messages/en.json";

export type Locale = "es" | "en";
export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";

const dictionaries = { es, en } as const;

export type Dictionary = typeof es;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
