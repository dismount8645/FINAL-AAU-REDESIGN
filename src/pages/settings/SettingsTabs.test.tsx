import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ProfileTab,
  NotificationsTab,
  LanguageTab,
  ForumTab,
  CalendarTab,
  MessagesTab,
} from './index'
import useStore from '@/store/useStore'

// Mock useToast
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
}

vi.mock('@/context/ToastContext', () => ({
  useToast: () => mockToast,
}))

describe('Settings Tabs Components', () => {
  beforeEach(() => {
    useStore.setState({ lang: 'da' })
  })

  describe('ProfileTab', () => {
    it('renders profile fields and calls handlers', () => {
      const setFirstName = vi.fn()
      const setLastName = vi.fn()
      const setTheme = vi.fn()

      render(
        <ProfileTab
          firstName="First"
          lastName="Last"
          theme="light"
          setFirstName={setFirstName}
          setLastName={setLastName}
          setTheme={setTheme}
        />
      )

      expect(screen.getByDisplayValue('First')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Last')).toBeInTheDocument()
      expect(screen.getByText('Skift profilbillede')).toBeInTheDocument()

      const firstInput = screen.getByLabelText('Fornavn')
      fireEvent.change(firstInput, { target: { value: 'NewFirst' } })
      expect(setFirstName).toHaveBeenCalledWith('NewFirst')

      const darkThemeButton = screen.getByLabelText('Mørk')
      fireEvent.click(darkThemeButton)
      expect(setTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('NotificationsTab', () => {
    it('renders notification options and handles switch clicks', () => {
      const setNotifPrefs = vi.fn()
      const notifPrefs = { email: true, push: false, sms: false }

      render(
        <NotificationsTab
          notifPrefs={notifPrefs}
          setNotifPrefs={setNotifPrefs}
        />
      )

      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Push')).toBeInTheDocument()

      const emailSwitch = screen.getAllByRole('switch')[0]
      fireEvent.click(emailSwitch)
      expect(setNotifPrefs).toHaveBeenCalled()
    })
  })

  describe('LanguageTab', () => {
    it('renders language choices and handles selection', () => {
      const setLang = vi.fn()

      render(
        <LanguageTab
          lang="da"
          setLang={setLang}
        />
      )

      expect(screen.getByText('Dansk (Danish)')).toBeInTheDocument()
      expect(screen.getByText('English (English)')).toBeInTheDocument()

      fireEvent.click(screen.getByText('English (English)'))
      expect(setLang).toHaveBeenCalledWith('en')
    })
  })

  describe('ForumTab', () => {
    it('renders forum configuration settings and calls handlers', () => {
      const setForumDigest = vi.fn()
      const setForumTracking = vi.fn()
      const setForumAutoSubscribe = vi.fn()

      render(
        <ForumTab
          forumDigest="complete"
          forumTracking={true}
          forumAutoSubscribe={false}
          setForumDigest={setForumDigest}
          setForumTracking={setForumTracking}
          setForumAutoSubscribe={setForumAutoSubscribe}
        />
      )

      expect(screen.getByText('E-mail opsamlingstype')).toBeInTheDocument()
      
      const noneBtn = screen.getByText('Ingen opsamling')
      fireEvent.click(noneBtn)
      expect(setForumDigest).toHaveBeenCalledWith('none')

      const trackingToggle = screen.getByLabelText('Forumsporing')
      fireEvent.click(trackingToggle)
      expect(setForumTracking).toHaveBeenCalledWith(false)
    })
  })

  describe('CalendarTab', () => {
    it('renders calendar dropdown settings and calls handlers', () => {
      const setCalendarStartDay = vi.fn()
      const setCalendarDefaultView = vi.fn()

      render(
        <CalendarTab
          calendarStartDay="monday"
          calendarDefaultView="month"
          setCalendarStartDay={setCalendarStartDay}
          setCalendarDefaultView={setCalendarDefaultView}
        />
      )

      expect(screen.getByText('Ugens første dag')).toBeInTheDocument()
      expect(screen.getByText('Standard visning')).toBeInTheDocument()

      const startDaySelect = screen.getAllByRole('combobox')[0]
      fireEvent.change(startDaySelect, { target: { value: 'sunday' } })
      expect(setCalendarStartDay).toHaveBeenCalledWith('sunday')
    })
  })

  describe('MessagesTab', () => {
    it('renders message privacy controls and calls handlers', () => {
      const setMessagePrivacy = vi.fn()
      const setMessageEmailOffline = vi.fn()

      render(
        <MessagesTab
          messagePrivacy="courses"
          messageEmailOffline={true}
          setMessagePrivacy={setMessagePrivacy}
          setMessageEmailOffline={setMessageEmailOffline}
        />
      )

      expect(screen.getByText('Hvem kan kontakte mig')).toBeInTheDocument()
      
      const radio = screen.getByLabelText(/Kun mine kontakter/i)
      fireEvent.click(radio)
      expect(setMessagePrivacy).toHaveBeenCalledWith('contacts')

      const emailSwitch = screen.getByRole('button')
      fireEvent.click(emailSwitch)
      expect(setMessageEmailOffline).toHaveBeenCalled()
    })
  })
})
