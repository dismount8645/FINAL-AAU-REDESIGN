import { memo } from 'react';


import { Phone, Mail, MapPin, ShieldHalf, Monitor, Signal, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { SectionHeader } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading, Text } from '@/components/ui';
import useStore from '@/store';

interface SupportSidebarProps {
  children?: React.ReactNode
}

function SupportSidebar({ children }: SupportSidebarProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  return (
    <aside className="support-sidebar flex flex-col gap-lg">
      {/* Group 1: Kontakt */}
      <div>
        <SectionHeader
          title={lang === 'da' ? 'Kontakt' : 'Contact'}
          level={3}
        />
        <Stack gap="xs">
          {children}
          <a
            href="tel:+4599402020"
            className="flex items-center justify-between gap-xs p-md rounded-[var(--radius-md)] border border-border bg-bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <Stack gap="2xs">
              <Text size="sm" weight="bold" className="text-main">+45 9940 2020</Text>
              <Text size="2xs" muted>{lang === 'da' ? 'Man–fre 08:00–15:00' : 'Mon–Fri 08:00–15:00'}</Text>
            </Stack>
            <Phone size={18} strokeWidth={2} className="text-primary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>
        </Stack>
      </div>

      {/* Group 2: Selvhjælp */}
      <div>
        <SectionHeader
          title={lang === 'da' ? 'Selvhjælp' : 'Self-help'}
          level={3}
        />
        <Card>
          <Card.Body padding="compact">
            <Text size="xs" weight="bold" className="text-muted uppercase tracking-wider mb-xs">{t('guides')}</Text>
            {[
              { label: t('guide_overview'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
              { label: t('guide_students'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
              { label: t('guide_teachers'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
              { label: t('guide_staff'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2xs px-xs text-sm text-primary hover:underline underline-offset-2 rounded-md hover:bg-bg-hover transition-colors group"
              >
                {item.label}
                <ChevronRight size={14} className="shrink-0 text-muted opacity-0 group-hover:opacity-40 transition-opacity" />
              </a>
            ))}
            <div className="border-t border-border mt-xs pt-xs">
              <Text size="xs" weight="bold" className="text-muted uppercase tracking-wider mb-3xs">{t('self_service')}</Text>
              <Button variant="ghost" size="sm" icon={ShieldHalf} className="justify-start text-primary hover:underline underline-offset-2 w-full">
                {t('gdpr_faq')}
              </Button>
              <Button variant="ghost" size="sm" icon={Monitor} className="justify-start text-primary hover:underline underline-offset-2 w-full">
                {t('it_support_portal')}
              </Button>
              <Button variant="ghost" size="sm" icon={Signal} className="justify-start text-primary hover:underline underline-offset-2 w-full">
                {t('system_status')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Group 3: Status */}
      <div>
        <SectionHeader
          title={lang === 'da' ? 'Status' : 'Status'}
          level={3}
        />
        <Card>
          <Card.Body padding="compact">
            <Stack gap="sm">
              <Stack direction="row" align="center" gap="xs">
                <span className="w-2 h-2 rounded-full bg-muted shrink-0" />
                <Text size="sm" className="text-muted">
                  {lang === 'da' ? 'Chat: Lukket nu · Åbner mandag kl. 08:00' : 'Chat: Closed now · Opens Monday 08:00'}
                </Text>
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </div>

      {/* Group 4: Kontaktoplysninger (collapsed by default) */}
      <details className="group">
        <summary className="flex items-center gap-xs text-sm font-bold text-muted cursor-pointer py-xs px-xs rounded-md hover:bg-bg-hover transition-colors [&::-webkit-details-marker]:hidden">
          <ChevronRight size={14} className="shrink-0 transition-transform duration-200 group-open:rotate-90" />
          {lang === 'da' ? 'Kontaktoplysninger' : 'Contact Information'}
        </summary>
        <div className="pt-sm pb-xs px-xs">
          <Card className="bg-subtle">
            <Card.Body padding="compact">
              <Heading level={3} className="mb-xs text-sm text-main">
                <MapPin size={16} strokeWidth={2} className="inline mr-2xs align-text-bottom text-muted" />
                {t('main_office')}
              </Heading>
              <Text size="sm" className="text-muted leading-relaxed">
                Fredrik Bajers Vej 7K<br />
                9220 Aalborg Ø<br />
                <a href="tel:+4599402020" className="text-primary hover:underline flex items-center gap-sm mt-2xs">
                  <Phone size={14} strokeWidth={2} /> Tlf.: 9940 2020
                </a>
                <a href="mailto:aau@aau.dk" className="text-primary hover:underline flex items-center gap-sm mt-2xs">
                  <Mail size={14} strokeWidth={2} /> aau@aau.dk
                </a>
              </Text>
            </Card.Body>
          </Card>
        </div>
      </details>
    </aside>
  )
}

export default memo(SupportSidebar)

