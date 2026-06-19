import { Headphones, ExternalLink } from 'lucide-react';
import { Card, Text, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { env } from '@/lib/utils';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

function SupportWidget({ size = 'medium' }: WidgetProps) {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
  return (
    <Card className="support-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Headphones size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('contact_its_support')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex flex-col justify-center gap-[var(--space-2xs)]">
        {size !== 'small' && (
          <Text size="xs" className="text-text-muted leading-relaxed">
            {t('aau_it_services')}
          </Text>
        )}
        
        {size === 'large' && (
          <div className="flex flex-col gap-[2px] text-[11px] text-muted border-y border-[var(--border-color)]/40 py-[var(--space-2xs)] my-[var(--space-2xs)]">
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Telefon:' : 'Phone:'}</span>
              <span>+45 9940 2020</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">{lang === 'da' ? 'Åbningstider:' : 'Hours:'}</span>
              <span>{lang === 'da' ? 'Man-Fre 08:00–15:30' : 'Mon-Fri 08:00–15:30'}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="inline-flex items-center gap-xs text-xs text-primary hover:text-primary/80 font-semibold transition-colors group/support-btn self-start"
        >
          <ExternalLink size={12} strokeWidth={2} className="shrink-0" />
          <span className="group-hover/support-btn:underline underline-offset-2">{t('contact_support')}</span>
        </button>
      </Card.Body>
    </Card>
  )
}

export { SupportWidget }
