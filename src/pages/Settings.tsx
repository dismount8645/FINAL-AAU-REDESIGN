import { User, Globe, MessageSquare, Code, Calendar, Database, Key, Mail, Bell, Archive, FileText, Settings as SettingsIcon, ExternalLink, PlusCircle, Award, Sliders, ArrowLeft } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import PageLayout from '@/components/Layout/PageLayout';
import { AnimatePresence, motion } from 'framer-motion'
import { Card } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import SplitLayout from '@/components/Layout/SplitLayout';
import { Text } from '@/components/ui'
import { Button } from '@/components/ui'
import { Icon } from '@/components/ui'
import { Avatar } from '@/components/ui'
import { MasterItem } from '@/components/ui'
import useStore from '@/store'
import { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/ui'
import { SETTINGS_CATEGORIES } from '@/config/settingsCategories'
import { ProfileTab, NotificationsTab, LanguageTab, ForumTab, CalendarTab, MessagesTab } from '@/components/Settings'

const catIcons: Record<string, typeof User> = {
  bruger: User,
  indstillinger: SettingsIcon,
  avanceret: Sliders,
}

const itemIcons: Record<string, typeof User> = {
  profil: User,
  sprog: Globe,
  forum: MessageSquare,
  editor: Code,
  kalender: Calendar,
  indholdsbank: Database,
  sikkerhedsnogler: Key,
  beskeder: Mail,
  notifikationer: Bell,
  arkiver: Archive,
  eksempler: FileText,
  blogindstillinger: SettingsIcon,
  eksterneb: ExternalLink,
  registrerb: PlusCircle,
  badgeadm: Award,
  badgeind: Sliders,
}

function Settings() {
  const t = useStore(state => state.t)
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()
  const activeTab = searchParams.get('tab') || 'profil'
  const [expandedCats, setExpandedCats] = useState<string[]>(['bruger', 'indstillinger'])
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const firstName = useStore(state => state.firstName)
  const lastName = useStore(state => state.lastName)
  const isSaving = useStore(state => state.isSaving)
  const handleStoreSave = useStore(state => state.handleSave)

  const handleSave = useCallback(async () => {
    await handleStoreSave(toast, t)
  }, [handleStoreSave, toast, t])

  const handleTabClick = useCallback((id: string) => {
    setSearchParams({ tab: id })
    setMobileDetailOpen(true)
  }, [setSearchParams])

  const toggleCat = useCallback((id: string): void => {
    setExpandedCats(prev => prev.includes(id)
      ? prev.filter(c => c !== id)
      : [...prev, id]
    )
  }, [])

  const activeTabLabel = useMemo(
    () => {
      const allItems = (SETTINGS_CATEGORIES as ReadonlyArray<{ id: string; nameKey: string; items: ReadonlyArray<{ id: string; nameKey: string }> }>)
        .flatMap(c => c.items)
      return allItems.find(i => i.id === activeTab)?.nameKey ?? 'settings'
    },
    [activeTab]
  )

  const categories = SETTINGS_CATEGORIES

  return (
    <PageLayout
      className="two-panel-page settings-page"
      pageKey="settings"
      flat
      breadcrumbs={[{ label: t('nav.dashboard'), href: '/' }, { label: t('nav.settings') }]}
    >

      <div className="container pb-2xl pt-sm">
        <SplitLayout
          sidebarPosition="left"
          showDetailOnMobile={mobileDetailOpen}
          fullHeight={false}
          detailHeader={
            <div className="md:hidden flex items-center h-14 px-md border-b border-border bg-bg-card">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={() => setMobileDetailOpen(false)}
                className="font-bold"
              >
                {t('common.back')}
              </Button>
            </div>
          }
          sidebar={
            <Card className="flex flex-col p-[var(--space-0)] h-full w-full border-none">
              <Card.Header className="border-b border-border">
                <Stack direction="row" gap="md" align="center">
                  <Avatar name={`${firstName} ${lastName}`} size="md" />
                  <Text weight="bold" size="md" className="text-main">{`${firstName} ${lastName}`}</Text>
                </Stack>
              </Card.Header>
              <Card.Body className="p-sm">
                {categories.map((cat) => (
                  <Stack key={cat.id} gap="2xs" className="mb-md">
                    <Stack
                      direction="row"
                      align="center"
                      justify="between"
                      onClick={() => toggleCat(cat.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleCat(cat.id)
                        }
                      }}
                      className="settings__cat-header cursor-pointer py-sm px-xs hover:bg-bg-hover rounded-[var(--radius-sm)] transition-colors border-l-4 border-border hover:border-primary/40"
                    >                      <Stack direction="row" align="center" gap="sm">
                        {(() => {
                           const CatIcon = catIcons[cat.id]
                           /* istanbul ignore next */
                           return CatIcon ? <CatIcon size={14} strokeWidth={2} className="text-muted opacity-50 shrink-0" /> : null
                        })()}
                        <Text size="xs" weight="extrabold" muted className="text-uppercase tracking-wider">{t(cat.nameKey)}</Text>
                      </Stack>
                      <Icon name={`chevron-${expandedCats.includes(cat.id) ? 'up' : 'down'}`} className="settings__chevron text-[0.65rem] opacity-40 text-muted" />
                    </Stack>
                    {expandedCats.includes(cat.id) && cat.items.map((item) => (
                      <MasterItem
                        key={item.id}
                        leading={itemIcons[item.id]}
                        title={t(item.nameKey)}
                        selected={activeTab === item.id}
                        onClick={() => handleTabClick(item.id)}
                        className="rounded-[var(--radius-md)] ml-sm border-none"
                      />
                    ))}
                  </Stack>
                ))}
              </Card.Body>
            </Card>
          }
          main={
            <Card className="flex flex-col p-[var(--space-0)] h-full w-full border-none">
              <Card.Header className="border-b border-border shrink-0">
                <Stack gap="2xs">
                  <Text weight="bold" size="lg" className="card__title text-main">{t(activeTabLabel)}</Text>
                  <Text muted size="sm">{t('settings.subtitle')}</Text>
                </Stack>
              </Card.Header>
              
              <Card.Body className="p-lg overflow-y-auto flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === 'profil' ? (
                      <ProfileTab />
                    ) : activeTab === 'notifikationer' ? (
                      <NotificationsTab />
                    ) : activeTab === 'sprog' ? (
                      <LanguageTab />
                    ) : activeTab === 'forum' ? (
                      <ForumTab />
                    ) : activeTab === 'kalender' ? (
                      <CalendarTab />
                    ) : activeTab === 'beskeder' ? (
                      <MessagesTab />
                    ) : (
                      <Stack align="center" justify="center" className="settings__empty-state py-[var(--space-3xl)] border-2 border-dashed border-border rounded-[var(--radius-lg)] bg-bg-highlight/50">
                         <Icon name="gear" size="3xl" className="text-muted opacity-30 mb-md" />
                         <Text muted>{t('settings.under_development')}</Text>
                      </Stack>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Card.Body>

              {(activeTab === 'profil' || activeTab === 'forum' || activeTab === 'kalender' || activeTab === 'beskeder') && (
                <Card.Footer className="border-t border-border p-lg shrink-0 bg-bg-card z-10 sticky bottom-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.2)]">
                  <Button variant="primary" size="md" onClick={handleSave} loading={isSaving} className="self-start">{t('settings.save_changes')}</Button>
                </Card.Footer>
              )}
            </Card>
          }
        />
      </div>
    </PageLayout>
  )
}

export default Settings

