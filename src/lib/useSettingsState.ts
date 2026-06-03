import { useState, useCallback, useMemo, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/Toast'
import useStore from '@/lib/store'
import { storage } from '@/lib/storage'
import { saveSettings } from '@/lib/api'
import { SETTINGS_CATEGORIES } from '@/lib/settingsCategories'

export interface UseSettingsStateReturn {
  activeTab: string
  expandedCats: string[]
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  notifPrefs: { email: boolean; push: boolean; sms: boolean }
  setNotifPrefs: Dispatch<SetStateAction<{ email: boolean; push: boolean; sms: boolean }>>
  mobileView: 'menu' | 'pane'
  setMobileView: (v: 'menu' | 'pane') => void
  forumDigest: 'none' | 'complete' | 'subjects'
  setForumDigest: (v: 'none' | 'complete' | 'subjects') => void
  forumTracking: boolean
  setForumTracking: (v: boolean) => void
  forumAutoSubscribe: boolean
  setForumAutoSubscribe: (v: boolean) => void
  calendarStartDay: 'monday' | 'sunday'
  setCalendarStartDay: (v: 'monday' | 'sunday') => void
  calendarDefaultView: 'month' | 'week' | 'day'
  setCalendarDefaultView: (v: 'month' | 'week' | 'day') => void
  messagePrivacy: 'contacts' | 'courses' | 'anyone'
  setMessagePrivacy: (v: 'contacts' | 'courses' | 'anyone') => void
  messageEmailOffline: boolean
  setMessageEmailOffline: (v: boolean) => void
  activeTabLabel: string
  isSaving: boolean
  handleSave: () => Promise<void>
  handleTabClick: (id: string) => void
  toggleCat: (id: string) => void
  categories: typeof SETTINGS_CATEGORIES
}

export function useSettingsState(): UseSettingsStateReturn {
  const t = useStore(state => state.t)
  const isMobile = useStore(state => state.isMobile)
  const theme = useStore(state => state.theme)
  const lang = useStore(state => state.lang)
  const [searchParams] = useSearchParams()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profil')
  const [expandedCats, setExpandedCats] = useState<string[]>(['bruger', 'indstillinger'])
  const [firstName, setFirstName] = useState(() => storage.get('userFirstName', 'Jacob Krarup'))
  const [lastName, setLastName] = useState(() => storage.get('userLastName', 'Madsen'))
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false })
  const [mobileView, setMobileView] = useState<'menu' | 'pane'>('menu')

  const [forumDigest, setForumDigest] = useState<'none' | 'complete' | 'subjects'>('complete')
  const [forumTracking, setForumTracking] = useState(true)
  const [forumAutoSubscribe, setForumAutoSubscribe] = useState(true)

  const [calendarStartDay, setCalendarStartDay] = useState<'monday' | 'sunday'>('monday')
  const [calendarDefaultView, setCalendarDefaultView] = useState<'month' | 'week' | 'day'>('month')

  const [messagePrivacy, setMessagePrivacy] = useState<'contacts' | 'courses' | 'anyone'>('courses')
  const [messageEmailOffline, setMessageEmailOffline] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
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
    } finally {
      setIsSaving(false)
    }
  }, [firstName, lastName, lang, theme, notifPrefs, forumDigest, forumTracking, forumAutoSubscribe, toast, t])

  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id)
    if (isMobile) {
      setMobileView('pane')
    }
  }, [isMobile])

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

  return {
    activeTab,
    expandedCats,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    notifPrefs,
    setNotifPrefs,
    mobileView,
    setMobileView,
    forumDigest,
    setForumDigest,
    forumTracking,
    setForumTracking,
    forumAutoSubscribe,
    setForumAutoSubscribe,
    calendarStartDay,
    setCalendarStartDay,
    calendarDefaultView,
    setCalendarDefaultView,
    messagePrivacy,
    setMessagePrivacy,
    messageEmailOffline,
    setMessageEmailOffline,
    activeTabLabel,
    isSaving,
    handleSave,
    handleTabClick,
    toggleCat,
    categories: SETTINGS_CATEGORIES,
  }
}
