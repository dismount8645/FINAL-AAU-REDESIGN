/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion'
import { Text } from '@/components/Typography'
import useStore from '@/store/useStore'

function linkifyText(text: string): React.ReactNode {
  const urlPattern = /(https?:\/\/[^\s]+|[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{part}</a>
    }
    return part
  })
}

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
      <Accordion className="space-y-sm">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="px-md rounded-[var(--radius-md)]">
            <AccordionTrigger><span className="text-left font-medium">{faq.q}</span></AccordionTrigger>
            <AccordionContent>
              <Text size="sm" className="text-text-muted leading-relaxed pb-sm">{linkifyText(faq.a)}</Text>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  )
}

export default memo(FaqSection)
export { linkifyText }
