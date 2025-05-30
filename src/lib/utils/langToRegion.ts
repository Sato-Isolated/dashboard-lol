// src/utils/langToRegion.ts

/**
 * Map a browser language string (e.g. 'fr-FR', 'en-US') to a default LoL region.
 * @param lang - The browser language string
 * @returns The default region string (e.g. 'euw1', 'na1')
 */
export function mapLangToRegion(lang: string): string {
  const l = lang.toLowerCase();
  if (l.startsWith('fr')) {
    return 'euw1';
  }
  if (l.startsWith('en-us')) {
    return 'na1';
  }
  if (l.startsWith('en-gb')) {
    return 'euw1';
  }
  if (l.startsWith('es')) {
    return 'euw1';
  }
  if (l.startsWith('tr')) {
    return 'tr1';
  }
  if (l.startsWith('ru')) {
    return 'ru';
  }
  if (l.startsWith('ja')) {
    return 'jp1';
  }
  if (l.startsWith('ko')) {
    return 'kr';
  }
  return 'euw1';
}
