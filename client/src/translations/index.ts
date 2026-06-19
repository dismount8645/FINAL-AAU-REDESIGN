import { da as daFlat } from './da';
import { en as enFlat } from './en';
import type { Lang } from '@/lib/theme';


function buildNestedTranslations(flat: Record<string, string>) {
  const obj: any = { ...flat };
  for (const [key, value] of Object.entries(flat)) {
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part] || typeof current[part] === 'string') {
          current[part] = {};
        }
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    }
  }
  return obj;
}

export const translations = {
  da: buildNestedTranslations(daFlat),
  en: buildNestedTranslations(enFlat),
};

export function getTranslation(key: string, lang: Lang, replacements?: Record<string, string | number>): string {
  const flatDict = lang === 'en' ? enFlat : daFlat;
  let text = flatDict[key as keyof typeof flatDict] as string | undefined;
  
  if (typeof text !== 'string') {
    text = key;
  }
  
  if (replacements && typeof text === 'string') {
    let resultText: string = text;
    Object.entries(replacements).forEach(([k, v]) => {
      resultText = resultText.replace('{' + k + '}', String(v));
    });
    return resultText;
  }
  return text;
}
