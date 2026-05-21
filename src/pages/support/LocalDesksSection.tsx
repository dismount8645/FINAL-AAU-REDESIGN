import { memo } from 'react'
import { Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import SectionHeader from '@/components/ui/SectionHeader'
import KeyValue from '@/components/ui/KeyValue'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'
import { supportLocations, supportDeskHours, supportNotes } from '@/data/support'

function LocalDesksSection() {
  const { t, localize } = useStore()

  return (
    <Stack gap="lg">
      <Card>
        <SectionHeader
          title={t('find_local_service_desk')}
          level={2}
          className="mb-sm"
        />
        <AccordionWrapper>
          {supportLocations.map((loc, i) => (
            <AccordionItemDummy key={`loc-${i}`} city={loc.city} address={loc.address} zip={loc.zip} />
          ))}
        </AccordionWrapper>
      </Card>

      <Card>
        <section>
          <Heading level={3} className="text-base mb-sm">{t('special_opening_hours')}</Heading>
          <Stack gap="sm">
            <Text size="sm" className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{t('low_service_days')}</span> {localize(supportNotes, 'specialDays')}
            </Text>
            <Text size="sm" className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{t('july_month')}</span> {localize(supportNotes, 'july')}
            </Text>
            <Text size="sm" className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{t('christmas_ny')}</span> {localize(supportNotes, 'christmas')}
            </Text>
          </Stack>
        </section>
      </Card>

      <Card>
        <Stack gap="sm">
          <Heading level={3}>{t('it_support_comes_to_you')}</Heading>
          <Text size="sm" className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('it_support_comes_to_you_desc')}
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}

// Internal small helpers to render the exact Accordion structure from parent
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

const AccordionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Accordion>
      {children}
    </Accordion>
  )
}

const AccordionItemDummy = ({ city, address, zip }: { city: string, address: string, zip: string }) => {
  const { t, localize } = useStore()
  return (
    <AccordionItem value={city} className="border-b border-border last:border-0">
      <AccordionTrigger>
        <span className="text-left font-semibold text-slate-800 dark:text-slate-100">{city}</span>
      </AccordionTrigger>
      <AccordionContent>
        <Stack gap="sm" className="pb-2xs">
          <div>
            <Text size="sm" className="text-slate-700 dark:text-slate-300">{address}</Text>
            <Text size="xs" className="text-slate-500 dark:text-slate-400">{zip}</Text>
          </div>
          <div className="border-t border-border pt-2xs">
            <Text size="xs" weight="semibold" className="flex items-center gap-3xs text-slate-600 dark:text-slate-400 mb-3xs">
              <Clock size={14} strokeWidth={2} />
              {t('opening_hours_service_desk')}
            </Text>
            <Stack gap="2xs">
              {supportDeskHours.map((oh, j) => (
                <KeyValue
                  key={j}
                  label={localize(oh, 'days')}
                  value={oh.hours}
                  divider={false}
                />
              ))}
            </Stack>
          </div>
        </Stack>
      </AccordionContent>
    </AccordionItem>
  )
}

export default memo(LocalDesksSection)
