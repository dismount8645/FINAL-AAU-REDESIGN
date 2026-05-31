import type { ReactNode } from 'react'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

export default function SettingsSection({ titleKey, descKey, children, className }: {
  titleKey: string
  descKey: string
  children: ReactNode
  className?: string
}) {
  const t = useStore(state => state.t)
  return (
    <Stack gap="xl" className={className}>
      <Stack gap="2xs">
        <Text weight="bold" size="md" className="text-main">{t(titleKey)}</Text>
        <Text muted size="sm">{t(descKey)}</Text>
      </Stack>
      {children}
    </Stack>
  )
}
