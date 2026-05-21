import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { User, Globe, MessageSquare, Code, Calendar, Database, Key, Mail, Bell, Archive, FileText, Settings as SettingsIcon, ExternalLink, PlusCircle, Award, Sliders, Shield, Folder, ChevronLeft } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Card from '@/components/ui/Card'
import Stack from '@/components/ui/Stack'
import Grid from '@/components/ui/Grid'
import { Text } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import ListItem from '@/components/ui/ListItem'
import useStore from '@/store/useStore'
import { storage } from '@/utils/storage'
import { saveSettings } from '@/api/settings'
import {
  ProfileTab,
  NotificationsTab,
  LanguageTab,
  ForumTab,
  CalendarTab,
  MessagesTab,
} from './settings/index'

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
  const { t, isMobile, theme, setTheme, lang, setLang } = useStore()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profil')
  const [expandedCats, setExpandedCats] = useState<string[]>(['bruger', 'indstillinger'])
  const [firstName, setFirstName] = useState(() => storage.get('userFirstName', 'Jacob Krarup'))
  const [lastName, setLastName] = useState(() => storage.get('userLastName', 'Madsen'))
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false })
  const [mobileView, setMobileView] = useState<'menu' | 'pane'>('menu')
  const toast = useToast()

  // Custom states for newly fleshed-out settings sections
  const [forumDigest, setForumDigest] = useState<'none' | 'complete' | 'subjects'>('complete')
  const [forumTracking, setForumTracking] = useState(true)
  const [forumAutoSubscribe, setForumAutoSubscribe] = useState(true)

  const [calendarStartDay, setCalendarStartDay] = useState<'monday' | 'sunday'>('monday')
  const [calendarDefaultView, setCalendarDefaultView] = useState<'month' | 'week' | 'day'>('month')

  const [messagePrivacy, setMessagePrivacy] = useState<'contacts' | 'courses' | 'anyone'>('courses')
  const [messageEmailOffline, setMessageEmailOffline] = useState(true)

  const handleSave = async () => {
    storage.set('userFirstName', firstName)
    storage.set('userLastName', lastName)
    try {
      await saveSettings({
        language: lang,
        theme,
        notifications: notifPrefs,
        forumPreferences: {
          digest: forumDigest,
          tracking: String(forumTracking),
          autoSubscribe: String(forumAutoSubscribe),
        },
      })
      toast.success(t('settings.save_success'))
    } catch {
      toast.error(t('common.save_error'))
    }
  }

  const handleTabClick = (id: string) => {
    setActiveTab(id)
    if (isMobile) {
      setMobileView('pane')
    }
  }

  const toggleCat = (id: string): void => {
    setExpandedCats(expandedCats.includes(id)
      ? expandedCats.filter((c) => c !== id)
      : [...expandedCats, id]
    )
  }

  const categories = [
    {
      id: 'bruger', nameKey: 'categories.user_account', items: [
        { id: 'profil', nameKey: 'categories.edit_profile' },
        { id: 'sprog', nameKey: 'categories.select_language' },
      ],
    },
    {
      id: 'indstillinger', nameKey: 'categories.preferences', items: [
        { id: 'forum', nameKey: 'categories.forum_settings' },
        { id: 'editor', nameKey: 'categories.editor_settings' },
        { id: 'kalender', nameKey: 'categories.calendar_settings' },
        { id: 'indholdsbank', nameKey: 'categories.content_bank' },
      ],
    },
    {
      id: 'sikkerhed', nameKey: 'categories.security', items: [
        { id: 'sikkerhedsnogler', nameKey: 'categories.security_keys' },
        { id: 'beskeder', nameKey: 'categories.message_settings' },
        { id: 'notifikationer', nameKey: 'categories.notification_settings' },
      ],
    },
    {
      id: 'filer', nameKey: 'categories.files', items: [
        { id: 'arkiver', nameKey: 'cat_file_archives' },
        { id: 'eksempler', nameKey: 'cat_manage_samples' },
      ],
    },
    {
      id: 'blogs', nameKey: 'cat_blogs', items: [
        { id: 'blogindstillinger', nameKey: 'cat_blog_settings' },
        { id: 'eksterneb', nameKey: 'cat_external_blogs' },
        { id: 'registrerb', nameKey: 'cat_register_blog' },
      ],
    },
    {
      id: 'badges', nameKey: 'cat_badges', items: [
        { id: 'badgeadm', nameKey: 'cat_manage_badges' },
        { id: 'badgeind', nameKey: 'cat_badge_settings' },
      ],
    },
  ]

  return (
    <Stack className="two-panel-page settings-page">
      <PageHeader pageKey="settings" flat breadcrumbs={[{ label: t('nav.dashboard'), href: '/' }, { label: t('nav.settings') }]} />

      <div className="container pb-2xl">
        <Grid>
          {(!isMobile || mobileView === 'menu') && (
            <Grid.Item span={4} tabletSpan={3} mobileSpan={12}>
              <Card className="panel-card flex flex-col p-[var(--space-0)] sticky top-32 self-start">
              <Card.Header className="border-b border-border">
                <Stack direction="row" gap="md" align="center">
                  <Avatar name={`${firstName} ${lastName}`} size="md" />
                  <Text weight="bold" size="md" className="text-main">{`${firstName} ${lastName}`}</Text>
                </Stack>
              </Card.Header>
              <Card.Body className="panel-scroll p-sm">
                {categories.map((cat) => (
                  <Stack key={cat.id} gap="2xs" className="mb-md">
                    <Stack
                      direction="row"
                      align="center"
                      justify="between"
                      onClick={() => toggleCat(cat.id)}
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
                      <ListItem
                        key={item.id}
                        icon={itemIcons[item.id]}
                        title={t(item.nameKey)}
                        active={activeTab === item.id}
                        onClick={() => handleTabClick(item.id)}
                        className="rounded-[var(--radius-md)] ml-sm"
                      />
                    ))}
                  </Stack>
                ))}
              </Card.Body>
            </Card>
          </Grid.Item>
          )}

          {(!isMobile || mobileView === 'pane') && (
            <Grid.Item span={8} tabletSpan={5} mobileSpan={12}>
              <Card className="panel-card flex flex-col p-[var(--space-0)]">
              <Card.Header className="border-b border-border">
                <Stack gap="2xs">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={ChevronLeft} 
                      onClick={() => setMobileView('menu')}
                      className="mb-[var(--space-sm)] -ml-[var(--space-sm)] self-start h-[var(--space-3xl)] px-2xs text-primary"
                    >
                      {t('common.back')}
                    </Button>
                  )}
                  <Text weight="bold" size="lg" className="card__title text-main">{t(categories.flatMap((c) => c.items).find((i) => i.id === activeTab)?.nameKey || 'settings')}</Text>
                  <Text muted size="sm">{t('settings.subtitle')}</Text>
                </Stack>
              </Card.Header>
              
              <Card.Body className="panel-scroll p-lg">
                {activeTab === 'profil' ? (
                  <ProfileTab
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    theme={theme}
                    setTheme={setTheme}
                  />
                ) : activeTab === 'notifikationer' ? (
                  <NotificationsTab
                    notifPrefs={notifPrefs}
                    setNotifPrefs={setNotifPrefs}
                  />
                ) : activeTab === 'sprog' ? (
                  <LanguageTab
                    lang={lang}
                    setLang={setLang}
                  />
                ) : activeTab === 'forum' ? (
                  <ForumTab
                    forumDigest={forumDigest}
                    setForumDigest={setForumDigest}
                    forumTracking={forumTracking}
                    setForumTracking={setForumTracking}
                    forumAutoSubscribe={forumAutoSubscribe}
                    setForumAutoSubscribe={setForumAutoSubscribe}
                  />
                ) : activeTab === 'kalender' ? (
                  <CalendarTab
                    calendarStartDay={calendarStartDay}
                    setCalendarStartDay={setCalendarStartDay}
                    calendarDefaultView={calendarDefaultView}
                    setCalendarDefaultView={setCalendarDefaultView}
                  />
                ) : activeTab === 'beskeder' ? (
                  <MessagesTab
                    messagePrivacy={messagePrivacy}
                    setMessagePrivacy={setMessagePrivacy}
                    messageEmailOffline={messageEmailOffline}
                    setMessageEmailOffline={setMessageEmailOffline}
                  />
                ) : (
                  <Stack align="center" justify="center" className="settings__empty-state py-[80px] border-2 border-dashed border-border rounded-[var(--radius-lg)] bg-bg-highlight/50">
                     <Icon name="gear" size="3xl" className="text-muted opacity-30 mb-md" />
                     <Text muted>{t('settings.under_development')}</Text>
                  </Stack>
                )}
              </Card.Body>

              {(activeTab === 'profil' || activeTab === 'forum' || activeTab === 'kalender' || activeTab === 'beskeder') && (
                <Card.Footer className="border-t border-border p-lg">
                  <Button variant="primary" size="md" onClick={handleSave} className="self-start">{t('settings.save_changes')}</Button>
                </Card.Footer>
              )}
            </Card>
          </Grid.Item>
          )}
        </Grid>
      </div>
    </Stack>
  )
}

export default Settings
