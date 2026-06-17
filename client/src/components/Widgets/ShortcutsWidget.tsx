import { useMemo, memo } from 'react';
import { Link2, ExternalLink } from 'lucide-react';
import { Card, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import useStore from '@/store';

interface WidgetProps {
  size?: 'small' | 'medium' | 'large'
}

function ShortcutsWidgetInner({ size = 'small' }: WidgetProps) {
  const lang = useStore(state => state.lang)
  
  const shortcuts = useMemo(() => [
    { name: 'Moodle', url: 'https://www.moodle.aau.dk' },
    { name: 'Digital Eksamen', url: 'https://eksamen.aau.dk' },
    { name: 'STADS Self-Service', url: 'https://stads.aau.dk' },
    { name: 'AAU Card', url: 'https://aaucard.aau.dk' },
    { name: 'AAU Webmail', url: 'https://mail.aau.dk' },
  ], [])

  const limit = size === 'small' ? 3 : size === 'medium' ? 4 : 5

  return (
    <Card className="shortcuts-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="xs">
          <div className="text-primary shrink-0">
            <Link2 size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {lang === 'da' ? 'Genveje' : 'Shortcuts'}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-xs)] flex flex-col gap-[var(--space-2xs)] justify-center">
        <div className="flex flex-col gap-1">
          {shortcuts.slice(0, limit).map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-sm px-sm hover:bg-bg-hover rounded-[var(--radius-md)] text-xs font-semibold text-main transition-colors group/shortcut-link border border-transparent hover:border-[var(--border-color)]/30 min-h-[44px]"
            >
              <span className="truncate">{s.name}</span>
              <span className="shrink-0 flex items-center gap-1 text-text-muted text-[10px] font-medium opacity-0 group-hover/shortcut-link:opacity-100 transition-all duration-200">
                <span>{lang === 'da' ? 'åbn' : 'open'}</span>
                <ExternalLink size={12} strokeWidth={2.5} />
              </span>
            </a>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

const ShortcutsWidget = memo(ShortcutsWidgetInner)

export { ShortcutsWidget }
