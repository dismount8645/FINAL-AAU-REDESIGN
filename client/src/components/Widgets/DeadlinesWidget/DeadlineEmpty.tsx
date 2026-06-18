import { CheckCircle2 } from 'lucide-react';
import { Text } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';

interface DeadlineEmptyProps {
  t: (key: string) => string;
}

function DeadlineEmpty({ t }: DeadlineEmptyProps) {
  return (
    <Stack align="center" justify="center" gap="sm" className="h-full py-[var(--space-lg)] opacity-50 italic">
      <CheckCircle2 size={32} className="text-[var(--aau-dark-green)]/40" />
      <Text size="xs">{t('all_caught_up')}</Text>
    </Stack>
  )
}

export default DeadlineEmpty
