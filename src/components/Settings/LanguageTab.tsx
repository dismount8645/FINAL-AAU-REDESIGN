import { Card, SectionHeader } from '@/components/ui'
import { Text } from '@/components/ui'
import { useToast } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'

interface LanguageTabProps {
  lang?: 'da' | 'en'
  setLang?: (lang: 'da' | 'en') => void
}

export default function LanguageTab(props: LanguageTabProps) {
  const store = useStore()
  const lang = props.lang ?? store.lang
  const setLang = props.setLang ?? store.setLang

  const t = store.t
  const toast = useToast()

  return (
    <Stack gap="xl" className="settings__language max-w-[36rem] animate-fade-in">
      <SectionHeader title={t('settings.select_language')} description={t('settings.language_desc')} className="!mb-0" />
      <div className="mt-2xs grid grid-cols-1 sm:grid-cols-2 gap-md">
        {[
          { id: 'da', title: 'Dansk (Danish)', desc: 'Skift systemets sprog til dansk' },
          { id: 'en', title: 'English (English)', desc: 'Switch system language to English' }
        ].map((langOpt) => (
          <Card 
            key={langOpt.id}
            variant="outlined" 
            onClick={() => {
              setLang(langOpt.id as 'da' | 'en')
              toast.success(t('settings.lang_changed_success'))
            }}
             className={`hover:border-primary/40 transition-all shrink-0 ${lang === langOpt.id ? 'border-primary bg-primary/5 shadow-sm' : ''}`}
          >
            <Card.Body className="p-lg flex gap-xs items-center">
              <div className="flex-1">
                <Text weight="bold" size="sm" className="text-main">{langOpt.title}</Text>
                <Text size="xs" muted className="mt-3xs">{langOpt.desc}</Text>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${lang === langOpt.id ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                {lang === langOpt.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Stack>
  )
}
