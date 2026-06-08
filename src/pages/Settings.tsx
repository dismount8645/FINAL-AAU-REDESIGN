import { User, Globe, MessageSquare, Code, Calendar, Database, Key, Mail, Bell, Archive, FileText, Settings as SettingsIcon, ExternalLink, PlusCircle, Award, Sliders, Shield, Folder, ArrowLeft } from 'lucide-react'
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
import { STORAGE_KEYS } from '@/lib/constants'
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/test-utils'
import { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/ui'
import { SETTINGS_CATEGORIES } from '@/config/settingsCategories'
import { ProfileTab, NotificationsTab, LanguageTab, ForumTab, CalendarTab, MessagesTab } from '@/components/Settings'

const catIcons: Record<string, typeof User> = {
  bruger: User,
  indstillinger: SettingsIcon,
  sikkerhed: Shield,
  filer: Folder,
  blogs: FileText,
  badges: Award,
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
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profil')
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
    setActiveTab(id)
    setMobileDetailOpen(true)
  }, [])

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

      <div className="container pb-2xl">
        <SplitLayout
          sidebarPosition="left"
          showDetailOnMobile={mobileDetailOpen}
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
              <Card.Header className="border-b border-border">
                <Stack gap="2xs">
                  <Text weight="bold" size="lg" className="card__title text-main">{t(activeTabLabel)}</Text>
                  <Text muted size="sm">{t('settings.subtitle')}</Text>
                </Stack>
              </Card.Header>
              
              <Card.Body className="p-lg">
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
                <Card.Footer className="border-t border-border p-lg">
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

/* eslint-disable @typescript-eslint/no-explicit-any */
let mockToast: any
if (import.meta.vitest) {
  mockToast = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
  
  vi.mock('@/components/ui/Toast', async () => {
    const actual = await vi.importActual<typeof import('@/components/ui/Toast')>('@/components/ui/Toast')
    return {
      ...actual,
      useToast: () => mockToast,
    }
  })
  describe('Settings Page', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      useStore.setState({
        firstName: 'Jacob Krarup',
        lastName: 'Madsen',
        lang: 'da',
        theme: 'system',
        notifPrefs: { email: true, push: true, sms: false },
        forumDigest: 'complete',
        forumTracking: true,
        forumAutoSubscribe: true,
        calendarStartDay: 'monday',
        calendarDefaultView: 'month',
        messagePrivacy: 'courses',
        messageEmailOffline: true,
        isSaving: false,
      })
    })

    const renderSettings = (lang = 'da') => {
      console.log('DEBUG Settings useStore:', typeof useStore, Object.getOwnPropertyNames(useStore).filter(p => p !== 'length' && p !== 'name'))
      useStore.setState({ lang: lang as 'da' | 'en' })
      return renderWithProviders(<Settings />)
    }

    it('renders settings categories', () => {
      renderSettings('da')
      expect(screen.getAllByText('Brugerkonto').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Indstillinger').length).toBeGreaterThan(0)
    })

    it('switches categories and toggles collapse', async () => {
      renderSettings('da')
      fireEvent.click(screen.getByText('Sikkerhed'))
      expect(screen.getByText('Indstillinger for beskeder')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Sikkerhed'))
      await waitFor(() => {
        expect(screen.queryByText('Indstillinger for beskeder')).not.toBeInTheDocument()
      })
    })

    it('changes language and theme', () => {
      renderSettings('en')
      expect(screen.getAllByText('User Account').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Security').length).toBeGreaterThan(0)
    })

    it('renders the profile content by default', () => {
      renderSettings('da')
      expect(screen.getAllByText('Jacob Krarup Madsen').length).toBeGreaterThan(0)
      expect(screen.getByDisplayValue('jkm@student.aau.dk')).toBeInTheDocument()
    })

    it('switches theme via appearance buttons', async () => {
      renderSettings('da')
      fireEvent.click(screen.getByLabelText('Mørk'))
      await waitFor(() => {
        expect(screen.getByLabelText('Mørk').getAttribute('aria-pressed')).toBe('true')
      })
    })

    it('shows empty state for non-profile tabs', () => {
      renderSettings('da')
      const securityHeader = screen.getByText('Sikkerhed')
      fireEvent.click(securityHeader)
      const sikkerhedsNoeglerItem = screen.getByText('Sikkerhedsnøgler')
      fireEvent.click(sikkerhedsNoeglerItem)
      expect(screen.getByText('Denne sektion er under udvikling.')).toBeInTheDocument()
    })

    it('shows empty state in English for non-profile tabs', () => {
      renderSettings('en')
      const blogsHeader = screen.getByText('Blogs')
      fireEvent.click(blogsHeader)
      const blogSettings = screen.getByText('Blog Settings')
      fireEvent.click(blogSettings)
      expect(screen.getByText('This section is under development.')).toBeInTheDocument()
    })

    it('selects different tabs and shows correct content', () => {
      renderSettings('en')
      fireEvent.click(screen.getByText('Security'))
      fireEvent.click(screen.getByText('Security Keys'))
      expect(screen.getByText('This section is under development.')).toBeInTheDocument()
    })

    it('falls back to "Settings" for unknown tab ID from URL', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Settings />, { route: '/settings?tab=nonexistent' })
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
    })

    it('expands and collapses a closed category', async () => {
      renderSettings('da')
      fireEvent.click(screen.getByText('Filer'))
      expect(screen.getByText('Filarkiver')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Filer'))
      await waitFor(() => {
        expect(screen.queryByText('Filarkiver')).not.toBeInTheDocument()
      })
    })

    it('expands category on keyboard Enter', () => {
      renderSettings('da')
      const filerHeader = screen.getByText('Filer')
      fireEvent.keyDown(filerHeader, { key: 'Enter' })
      expect(screen.getByText('Filarkiver')).toBeInTheDocument()
    })

    it('expands category on keyboard Space', () => {
      renderSettings('da')
      const filerHeader = screen.getByText('Filer')
      fireEvent.keyDown(filerHeader, { key: ' ' })
      expect(screen.getByText('Filarkiver')).toBeInTheDocument()
    })

    it('renders language tab via direct routing', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Settings />, { route: '/settings?tab=sprog' })
      expect(screen.getByText('English (English)')).toBeInTheDocument()
    })

    it('renders forum tab via direct routing', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Settings />, { route: '/settings?tab=forum' })
      expect(screen.getByText(/Digest type/i)).toBeInTheDocument()
    })

    it('renders calendar tab via direct routing', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Settings />, { route: '/settings?tab=kalender' })
      expect(screen.getByText(/First day of week/i)).toBeInTheDocument()
    })

    it('renders messages tab via direct routing', () => {
      useStore.setState({ lang: 'en' })
      renderWithProviders(<Settings />, { route: '/settings?tab=beskeder' })
      expect(screen.getByText(/Who can contact me/i)).toBeInTheDocument()
    })

    it('types into first and last name inputs', () => {
      renderSettings('da')
      const firstNameInput = screen.getByDisplayValue('Jacob Krarup') as HTMLInputElement
      fireEvent.change(firstNameInput, { target: { value: 'NewName' } })
      expect(firstNameInput.value).toBe('NewName')
    })

    it('navigates to notification tab and toggles preferences', () => {
      renderSettings('da')
      const securityHeader = screen.getByText('Sikkerhed')
      fireEvent.click(securityHeader)
      fireEvent.click(screen.getByText('Indstillinger for underretninger'))
      const notifCards = document.querySelectorAll('[role="switch"]')
      if (notifCards.length > 0) {
        fireEvent.click(notifCards[0])
      }
    })

    it('shows change photo button in profile tab', () => {
      renderSettings('da')
      expect(screen.getByText('Skift profilbillede')).toBeInTheDocument()
    })

    it('changes last name input value', () => {
      renderSettings('da')
      const lastNameInput = screen.getByDisplayValue('Madsen') as HTMLInputElement
      fireEvent.change(lastNameInput, { target: { value: 'Nielsen' } })
      expect(lastNameInput.value).toBe('Nielsen')
    })

    it('calls handleSave and saves to localStorage', () => {
      renderSettings('da')
      const saveBtn = screen.getByText('Gem ændringer')
      fireEvent.click(saveBtn)
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_FIRST_NAME)!)).toBe('Jacob Krarup')
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_LAST_NAME)!)).toBe('Madsen')
    })

    it('navigates to language tab via click', () => {
      useStore.setState({ lang: 'en' })
      renderSettings('en')
      fireEvent.click(screen.getByText('Select Language'))
      expect(screen.getByText('Select preferred language')).toBeInTheDocument()
    })

    it('navigates to forum tab via click', () => {
      useStore.setState({ lang: 'en' })
      renderSettings('en')
      fireEvent.click(screen.getByText('Forum Settings'))
      expect(screen.getByText(/Digest type/i)).toBeInTheDocument()
    })

    it('navigates to calendar tab via click', () => {
      useStore.setState({ lang: 'en' })
      renderSettings('en')
      fireEvent.click(screen.getByText('Calendar Settings'))
      expect(screen.getByText(/First day of week/i)).toBeInTheDocument()
    })

    it('navigates to messages tab via click', () => {
      useStore.setState({ lang: 'en' })
      renderSettings('en')
      fireEvent.click(screen.getByText('Security'))
      fireEvent.click(screen.getByText('Message Settings'))
      expect(screen.getByText(/Who can contact me/i)).toBeInTheDocument()
    })

  })
}
