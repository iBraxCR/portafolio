import es from '../i18n/es.json';
import en from '../i18n/en.json';

export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

const dictionaries = { es, en } as const;

export function t(key: string, lang: Locale = defaultLocale): string {
  const segments = key.split('.');
  const lookup = (dict: unknown): string | undefined => {
    let current: unknown = dict;
    for (const seg of segments) {
      if (current && typeof current === 'object' && seg in current) {
        current = (current as Record<string, unknown>)[seg];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };
  return lookup(dictionaries[lang]) ?? lookup(dictionaries.en) ?? key;
}

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function switchLocale(currentPath: string, to: Locale): string {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length === 0) return `/${to}/`;
  parts[0] = to;
  return `/${parts.join('/')}/`;
}
