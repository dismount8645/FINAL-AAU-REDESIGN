import type { Lang } from '../theme'
import { da } from './da'
import { en } from './en'

type TranslationValue = string | { [key: string]: TranslationValue }
type TranslationMap = Record<string, TranslationValue>

type Translations = Record<Lang, TranslationMap>

export const translations: Translations = { da, en } satisfies Translations

const flattenTranslationAliases = (allTranslations: Translations) => {
  for (const lang of Object.keys(allTranslations) as Lang[]) {
    const langMap = allTranslations[lang]

    for (const [categoryKey, categoryValue] of Object.entries(langMap)) {
      /* istanbul ignore next */
      if (!categoryValue || typeof categoryValue !== 'object' || Array.isArray(categoryValue)) {
        continue
      }

      const singularCategoryKey = categoryKey.endsWith('s') ? categoryKey.slice(0, -1) : categoryKey

      for (const [entryKey, entryValue] of Object.entries(categoryValue)) {
        if (typeof entryValue !== 'string') continue

        if (langMap[entryKey] === undefined) {
          langMap[entryKey] = entryValue
        }

        const categoryAlias = `${categoryKey}_${entryKey}`
        if (langMap[categoryAlias] === undefined) {
          langMap[categoryAlias] = entryValue
        }

        const singularAlias = `${singularCategoryKey}_${entryKey}`
        if (langMap[singularAlias] === undefined) {
          langMap[singularAlias] = entryValue
        }

        if (categoryKey === 'categories') {
          const categoryItemAlias = `cat_${entryKey}`
          if (langMap[categoryItemAlias] === undefined) {
            langMap[categoryItemAlias] = entryValue
          }
        }
      }
    }

    if (langMap.no_search_results === undefined && langMap.search_no_results !== undefined) {
      langMap.no_search_results = langMap.search_no_results
    }
  }
}

flattenTranslationAliases(translations)
