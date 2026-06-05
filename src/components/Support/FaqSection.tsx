import { memo } from 'react'
import { Card } from '@/components/ui'
import { SectionHeader } from '@/components/ui'
import { AccordionWrapper, AccordionItemRow } from '@/components/ui'
import { Text } from '@/components/ui'
import useStore from '@/store'
import { linkifyText } from '@/lib/utils'


function FaqSection() {
  const t = useStore(state => state.t)

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
    { q: t('faq_q7'), a: t('faq_a7') },
  ]

  return (
    <Card>
      <SectionHeader
        title={t('faq')}
        level={2}
        className="mb-sm"
      />
      <AccordionWrapper>
        {faqs.map((faq, i) => (
          <AccordionItemRow key={i} value={`faq-${i}`} title={faq.q}>
            <Text size="sm" className="text-text-muted leading-relaxed pb-sm">{linkifyText(faq.a)}</Text>
          </AccordionItemRow>
        ))}
      </AccordionWrapper>
    </Card>
  )
}

export default memo(FaqSection)
