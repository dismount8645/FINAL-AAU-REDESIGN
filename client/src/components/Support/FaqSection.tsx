import { memo } from 'react'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui'
import { SectionHeader } from '@/components/ui'
import { AccordionWrapper, AccordionItemRow } from '@/components/ui'
import { Text } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives'
import useStore from '@/store'
import { linkifyText } from '@/lib/utils'


/** Map FAQ group-index → item-index → next-step action */
const FAQ_ACTIONS: Record<string, { labelDa: string; labelEn: string; href: string }> = {
  '0-0': { labelDa: 'Gå til password-nulstilling', labelEn: 'Go to password reset', href: 'https://serviceportal.aau.dk' },
  '0-1': { labelDa: 'Se Wi-Fi-vejledning', labelEn: 'View Wi-Fi guide', href: 'https://www.en.aau.dk/digital-identity/moodle/' },
  '1-0': { labelDa: 'Gå til Moodle-support', labelEn: 'Go to Moodle support', href: 'https://www.en.aau.dk/digital-identity/moodle/' },
  '1-1': { labelDa: 'Gå til eksamenssystemer', labelEn: 'Go to exam systems', href: 'https://eksamen.aau.dk' },
  '2-0': { labelDa: 'Bestil assistance på stedet', labelEn: 'Request on-site assistance', href: 'https://serviceportal.aau.dk' },
}


function FaqSection() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const faqGroups = [
    {
      labelDa: 'Adgang',
      labelEn: 'Access',
      items: [
        { q: t('faq_q1'), a: t('faq_a1') },
        { q: t('faq_q3'), a: t('faq_a3') },
      ]
    },
    {
      labelDa: 'Systemer',
      labelEn: 'Systems',
      items: [
        { q: t('faq_q2'), a: t('faq_a2') },
        { q: t('faq_q4'), a: t('faq_a4') },
      ]
    },
    {
      labelDa: 'Udstyr og drift',
      labelEn: 'Equipment & operations',
      items: [
        { q: t('faq_q5'), a: t('faq_a5') },
        { q: t('faq_q6'), a: t('faq_a6') },
        { q: t('faq_q7'), a: t('faq_a7') },
      ]
    },
  ]

  return (
    <Card>
      <SectionHeader
        title={t('faq')}
        level={2}
        className="mb-xs"
      />
      <Stack gap="md">
        {faqGroups.map((group, gi) => (
          <div key={gi}>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted px-xs mb-xs pt-xs select-none">
              {lang === 'da' ? group.labelDa : group.labelEn}
            </div>
            <AccordionWrapper>
              {group.items.map((faq, ii) => {
                const actionKey = `${gi}-${ii}`
                const action = FAQ_ACTIONS[actionKey]
                return (
                  <AccordionItemRow key={actionKey} value={`faq-${gi}-${ii}`} title={faq.q}>
                    <Text size="sm" className="text-text-muted leading-relaxed pb-sm">{linkifyText(faq.a)}</Text>
                    {action && (
                      <a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3xs text-xs font-semibold text-primary hover:underline mt-2xs mb-sm"
                      >
                        {lang === 'da' ? action.labelDa : action.labelEn}
                        <ExternalLink size={11} strokeWidth={2} />
                      </a>
                    )}
                  </AccordionItemRow>
                )
              })}
            </AccordionWrapper>
          </div>
        ))}
      </Stack>
    </Card>
  )
}

export default memo(FaqSection)
