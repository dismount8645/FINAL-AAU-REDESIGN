import { memo } from 'react'
import { Clock, Phone, MapPin } from 'lucide-react'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { SectionHeader } from '@/components/ui'
import { KeyValue } from '@/components/ui'
import { Heading, Text } from '@/components/ui'
import useStore from '@/store'
import { supportLocations, supportDeskHours, supportNotes } from '@/lib/data'

import { AccordionWrapper, AccordionItemRow } from '@/components/ui'

function LocalDesksSection() {
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const lang = useStore(state => state.lang)

  return (
    <Stack gap="md">
      <Card>
        <SectionHeader
          title={t('find_local_service_desk')}
          level={2}
          className="mb-sm"
        />
        <Text size="xs" className="text-muted mb-sm px-md">{t('local_desk_helper')}</Text>
        <AccordionWrapper>
          {supportLocations.map((loc, i) => (
            <AccordionItemRow key={`loc-${i}`} value={loc.city} title={loc.city}>
              <Stack gap="sm" className="pb-2xs">
                <div>
                  <Text size="sm" className="text-main">{loc.address}</Text>
                  <Text size="xs" className="text-muted">{loc.zip}</Text>
                </div>
                
                {loc.phone && (
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="flex items-center gap-xs text-sm text-primary hover:underline">
                    <Phone size={14} strokeWidth={2} className="shrink-0" />
                    {loc.phone}
                  </a>
                )}
                
                {loc.mapUrl && (
                  <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-xs text-sm text-primary hover:underline">
                    <MapPin size={14} strokeWidth={2} className="shrink-0" />
                    {lang === 'da' ? 'Vis på kort' : 'Show on map'}
                  </a>
                )}
                
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
            </AccordionItemRow>
          ))}
        </AccordionWrapper>
        <div className="border-t border-border/40 pt-md mt-md px-md pb-xs">
          <Heading level={3} className="text-sm font-bold mb-xs">{t('special_opening_hours')}</Heading>
          <Stack gap="sm" className="divide-y divide-border/40 [&>div:not(:first-child)]:pt-sm">
            <div className="flex items-start gap-sm">
              <span className="shrink-0 px-2xs py-3xs text-[10px] font-bold uppercase tracking-wider rounded bg-warning/10 text-warning border border-warning/20">{t('low_service_days')}</span>
              <Text size="sm" className="text-muted">{localize(supportNotes, 'specialDays')}</Text>
            </div>
            <div className="flex items-start gap-sm">
              <span className="shrink-0 px-2xs py-3xs text-[10px] font-bold uppercase tracking-wider rounded bg-info/10 text-info border border-info/20">{t('july_month')}</span>
              <Text size="sm" className="text-muted">{localize(supportNotes, 'july')}</Text>
            </div>
            <div className="flex items-start gap-sm">
              <span className="shrink-0 px-2xs py-3xs text-[10px] font-bold uppercase tracking-wider rounded bg-primary/10 text-primary border border-primary/20">{t('christmas_ny')}</span>
              <Text size="sm" className="text-muted">{localize(supportNotes, 'christmas')}</Text>
            </div>
          </Stack>
        </div>
    </Card>
    </Stack>
  )
}

export default memo(LocalDesksSection)
