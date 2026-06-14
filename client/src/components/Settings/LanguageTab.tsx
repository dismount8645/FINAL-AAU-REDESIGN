import { useState } from 'react';
import { Card, SectionHeader } from '@/components/ui'
import { Text } from '@/components/ui'
import { useToast } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store'
import { Check } from 'lucide-react'
import AutosaveStatus from './AutosaveStatus'

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
  const [changeCount, setChangeCount] = useState(0)

  const bump = () => setChangeCount(c => c + 1)

  return (
    <Stack gap="lg" className="settings__language max-w-[36rem] animate-fade-in">
      <SectionHeader title={t('settings.select_language')} description={t('settings.language_desc')} className="!mb-0" />
      <AutosaveStatus changeCount={changeCount} />
      <div className="mt-2xs grid grid-cols-1 sm:grid-cols-2 gap-md">
        {[
          { id: 'da', title: 'Dansk (Danish)', desc: 'Skift systemets sprog til dansk' },
          { id: 'en', title: 'English (English)', desc: 'Switch system language to English' }
        ].map((langOpt) => {
          const isSelected = lang === langOpt.id;
          return (
            <Card 
              key={langOpt.id}
              variant="outlined" 
              onClick={() => {
                setLang(langOpt.id as 'da' | 'en')
                toast.success(t('settings.lang_changed_success'))
                bump()
              }}
              className={`hover:border-primary/40 transition-all shrink-0 relative ${isSelected ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20' : ''}`}
            >
              <Card.Body className="p-lg flex gap-xs items-center">
                <div className="flex-1">
                  <Text weight="bold" size="sm" className="text-main">{langOpt.title}</Text>
                  <Text size="xs" muted className="mt-3xs">{langOpt.desc}</Text>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                  {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Stack>
  )
}
