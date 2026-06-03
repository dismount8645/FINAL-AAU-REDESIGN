import { memo } from 'react'
import { Clock } from 'lucide-react'
import Card from '@/components/Card'
import Stack from '@/components/Stack'
import SectionHeader from '@/components/SectionHeader'
import KeyValue from '@/components/KeyValue'
import { Heading, Text } from '@/components/Typography'
import useStore from '@/store/useStore'
import mockData from '@/lib/mockData.json'
const { supportLocations, supportDeskHours, supportNotes } = mockData

function LocalDesksSection() {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)

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
            <Text size="sm" className="text-muted">
              <span className="font-semibold text-main">{t('low_service_days')}</span> {localize(supportNotes, 'specialDays')}
            </Text>
            <Text size="sm" className="text-muted">
              <span className="font-semibold text-main">{t('july_month')}</span> {localize(supportNotes, 'july')}
            </Text>
            <Text size="sm" className="text-muted">
              <span className="font-semibold text-main">{t('christmas_ny')}</span> {localize(supportNotes, 'christmas')}
            </Text>
          </Stack>
        </section>
      </Card>

      <Card>
        <Stack gap="sm">
          <Heading level={3}>{t('it_support_comes_to_you')}</Heading>
          <Text size="sm" className="text-muted leading-relaxed">
            {t('it_support_comes_to_you_desc')}
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}

// Internal small helpers to render the exact Accordion structure from parent
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/Accordion'

const AccordionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Accordion>
      {children}
    </Accordion>
  )
}

const AccordionItemDummy = ({ city, address, zip }: { city: string, address: string, zip: string }) => {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  return (
    <AccordionItem value={city} className="border-b border-border last:border-0">
      <AccordionTrigger>
        <span className="text-left font-semibold text-main">{city}</span>
      </AccordionTrigger>
      <AccordionContent>
        <Stack gap="sm" className="pb-2xs">
          <div>
            <Text size="sm" className="text-main">{address}</Text>
            <Text size="xs" className="text-muted">{zip}</Text>
          </div>
          <div className="border-t border-border pt-2xs">
            <Text size="xs" weight="semibold" className="flex items-center gap-3xs text-muted mb-3xs">
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
