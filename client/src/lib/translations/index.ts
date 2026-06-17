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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  const t = translations as any

  describe('translations', () => {
    it('has danish common.close equal Luk', () => {
      expect(t.da.common.close).toBe('Luk')
    })

    it('has english common.close equal Close', () => {
      expect(t.en.common.close).toBe('Close')
    })

    it('creates flat alias da.close after side-effect', () => {
      expect(t.da.close).toBe('Luk')
    })

    it('creates underscore alias da.common_close', () => {
      expect(t.da.common_close).toBe('Luk')
    })

    it('creates category alias da.cat_user_account', () => {
      expect(t.da.cat_user_account).toBe('Brugerkonto')
    })

    it('creates da.no_search_results from deeper key', () => {
      expect(t.da.no_search_results).toBe('Ingen resultater')
    })

    it('creates english flat alias en.close', () => {
      expect(t.en.close).toBe('Close')
    })

    it('creates english underscore alias en.common_close', () => {
      expect(t.en.common_close).toBe('Close')
    })

    it('creates english category alias en.cat_user_account', () => {
      expect(t.en.cat_user_account).toBe('User Account')
    })

    it('creates en.no_search_results from deeper key', () => {
      expect(t.en.no_search_results).toBe('No results')
    })

    it('has deep key da.nav.dashboard', () => {
      expect(t.da.nav.dashboard).toBe('Dashboard')
    })
  })
}
