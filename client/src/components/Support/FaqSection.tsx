import { memo } from 'react'
import { Card } from '@/components/ui'
import { SectionHeader } from '@/components/ui'
import { AccordionWrapper, AccordionItemRow } from '@/components/ui'
import { Text } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives'
import useStore from '@/store'
import { linkifyText } from '@/lib/utils'


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
      <Stack gap="sm">
        {faqGroups.map((group, gi) => (
          <div key={gi}>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted px-xs mb-3xs select-none">
              {lang === 'da' ? group.labelDa : group.labelEn}
            </div>
            <AccordionWrapper>
              {group.items.map((faq, ii) => (
                <AccordionItemRow key={`${gi}-${ii}`} value={`faq-${gi}-${ii}`} title={faq.q}>
                  <Text size="sm" className="text-text-muted leading-relaxed pb-sm">{linkifyText(faq.a)}</Text>
                </AccordionItemRow>
              ))}
            </AccordionWrapper>
          </div>
        ))}
      </Stack>
    </Card>
  )
}

export default memo(FaqSection)
