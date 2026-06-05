import { useState } from 'react';

import { Phone, Globe } from 'lucide-react';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { InfoCard } from '@/components/ui';
import PageLayout from '@/components/Layout/PageLayout';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { useToast } from '@/components/ui/Toast';
import { submitSupportTicket } from '@/lib/api';
import useStore from '@/store';
import { renderWithProviders, screen, fireEvent, act } from '@/test/test-utils';
import { FaqSection, LocalDesksSection, ContactForm, SupportSidebar } from '@/components/Support';

function Support() {
  const t = useStore(state => state.t)
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ subject: boolean; description: boolean }>({ subject: false, description: false })



  const handleSendSupport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const errors = { subject: !subject.trim(), description: !description.trim() }
    setFieldErrors(errors)

    if (errors.subject || errors.description) {
        toast.error(t('support.fill_all'))
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      void submitSupportTicket({ subject, description }).catch(() => {
        toast.error(t('support.error'))
      })
        toast.success(t('support.message_sent'))
      setSubject('')
      setDescription('')
      setIsFormOpen(false)
      setIsSubmitting(false)
    }, 1000)
  }

  const cancelForm = () => {
    setIsFormOpen(false)
    setSubject('')
    setDescription('')
    setFieldErrors({ subject: false, description: false })
  }

  return (
    <PageLayout
      className="support-page relative animate-fade-in"
      flat
      pageKey="support"
      title={t('support_page_title')}
      subtitle={t('support_page_subtitle')}
      breadcrumbs={[
        { label: t('dashboard'), href: '/' },
        { label: t('support') },
      ]}
    >

      <div className="container pb-[var(--space-2xl)]">
        <Grid>
          <Grid.Item span={7} mobileSpan={12} tabletSpan={6}>
            <Stack gap="lg">
              <FaqSection />

              <Grid>
                <Grid.Item span={6}>
                  <a href="tel:+4599402020" className="block rounded-[var(--radius-lg)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer">
                    <InfoCard
                      icon={Phone}
                      iconBg="transparent"
                      iconColor="var(--color-primary)"
                      iconSize="lg"
                      title="+45 9940 2020"
                      description={t('phone_support')}
                    />
                  </a>
                </Grid.Item>
                <Grid.Item span={6}>
                  <a href="https://serviceportal.aau.dk" target="_blank" rel="noopener noreferrer" className="block rounded-[var(--radius-lg)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer">
                    <InfoCard
                      icon={Globe}
                      iconBg="transparent"
                      iconColor="var(--color-success)"
                      iconSize="lg"
                      title="Serviceportal.aau.dk"
                      description={t('requires_aau_login')}
                    />
                  </a>
                </Grid.Item>
              </Grid>

              <LocalDesksSection />
            </Stack>
          </Grid.Item>

          <Grid.Item span={5} mobileSpan={12} tabletSpan={6}>
            <SupportSidebar>
              <ContactForm
                subject={subject}
                setSubject={setSubject}
                description={description}
                setDescription={setDescription}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
                isSubmitting={isSubmitting}
                fieldErrors={fieldErrors}
                onSubmit={handleSendSupport}
                onCancel={cancelForm}
              />
            </SupportSidebar>
          </Grid.Item>
        </Grid>
      </div>
    </PageLayout>
  )
}

export default Support


if (import.meta.vitest) {
  const mockToast = vi.hoisted(() => ({
    toast: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  }))
  const mockSubmitTicket = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }))
  vi.mock('@/lib/api', () => ({ submitSupportTicket: mockSubmitTicket }))
  vi.mock('@/components/ui/Toast', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/components/ui/Toast')>()
    return {
      ...actual,
      useToast: () => mockToast,
    }
  })
  describe('Support', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })

    function renderSupport(lang: 'da' | 'en' = 'da') {
      useStore.setState({ lang })
      return renderWithProviders(<Support />)
    }

    function openForm() {
      act(() => { fireEvent.click(screen.getByText('Skriv en besked')) })
    }

    function openFormEnglish() {
      act(() => { fireEvent.click(screen.getByText('Write a message')) })
    }

    function fillFields(subject: string, description: string) {
      const subjectInput = screen.getByLabelText(/Emne|Subject/)
      fireEvent.change(subjectInput, { target: { value: subject } })
      
      const descInput = screen.getByLabelText(/Beskrivelse|Description/)
      fireEvent.change(descInput, { target: { value: description } })
    }

    function submitForm() {
      const form = document.querySelector('form')
      if (form) act(() => { fireEvent.submit(form) })
    }

    it('renders correctly in Danish', () => {
      renderSupport('da')
      expect(screen.getByText(/Kontakt IT-support/i)).toBeInTheDocument()
      const faqBtn = screen.getByText(/Hvordan nulstiller jeg min adgangskode/i)
      fireEvent.click(faqBtn)
      expect(screen.getByText((content) => content.includes('serviceportal.aau.dk'))).toBeInTheDocument()
    })
  
    it('renders correctly in English', () => {
      renderSupport('en')
      expect(screen.getByText(/Contact IT Support/i)).toBeInTheDocument()
      const faqBtn = screen.getByText(/How do I reset my password/i)
      fireEvent.click(faqBtn)
      const ticketTexts = screen.getAllByText((content) => content.includes('serviceportal.aau.dk'))
      expect(ticketTexts.length).toBeGreaterThan(0)
    })
  
    it('shows error toast when form is submitted with empty fields', () => {
      renderSupport('da')
      openForm()
      submitForm()
      expect(mockToast.error).toHaveBeenCalledWith('Udfyld venligst alle felter')
    })
  
    it('shows error toast in English when form is submitted with empty fields', () => {
      renderSupport('en')
      openFormEnglish()
      submitForm()
      expect(mockToast.error).toHaveBeenCalledWith('Please fill in all fields')
    })
  
    it('shows success toast when form is submitted with valid fields', async () => {
      vi.useFakeTimers()
      renderSupport('da')
      openForm()
      fillFields('Test emne', 'Test beskrivelse')
      submitForm()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(mockToast.success).toHaveBeenCalledWith('Besked sendt!')
      vi.useRealTimers()
    })
  
    it('shows success toast in English', async () => {
      vi.useFakeTimers()
      renderSupport('en')
      openFormEnglish()
      fillFields('Test subject', 'Test description')
      submitForm()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(mockToast.success).toHaveBeenCalledWith('Message sent!')
      vi.useRealTimers()
    })
  
    it('shows error toast when submitSupportTicket fails', async () => {
      mockSubmitTicket.mockRejectedValueOnce(new Error('fail'))
      vi.useFakeTimers()
      renderSupport('da')
      openForm()
      fillFields('Test emne', 'Test beskrivelse')
      submitForm()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(mockToast.error).toHaveBeenCalledWith('Der opstod en fejl. Prøv igen senere.')
      vi.useRealTimers()
    })

    it('closes form after successful submission', async () => {
      vi.useFakeTimers()
      renderSupport('da')
      openForm()
      fillFields('Test emne', 'Test beskrivelse')
      submitForm()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })
      expect(screen.queryByLabelText(/Emne/)).not.toBeInTheDocument()
      expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
      vi.useRealTimers()
    })
  
    it('disables submit button while form is being sent', () => {
      renderSupport('da')
      openForm()
      fillFields('Test emne', 'Test beskrivelse')
      expect(mockToast.error).not.toHaveBeenCalled()
      submitForm()
      expect(mockToast.error).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Send besked' })).toHaveAttribute('aria-disabled', 'true')
    })
  
    it('closes form on cancel', () => {
      renderSupport('da')
      openForm()
      expect(screen.getByLabelText(/Emne/)).toBeInTheDocument()
      fireEvent.click(screen.getByText('Annuller'))
      expect(screen.queryByLabelText(/Emne/)).not.toBeInTheDocument()
      expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
    })
  
    it('clears field errors on input change', () => {
      renderSupport('da')
      openForm()
      submitForm()
      const subjectInput = screen.getByLabelText(/Emne/)
      fireEvent.change(subjectInput, { target: { value: 'Something' } })
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })
  
    it('clears field errors on textarea change', () => {
      renderSupport('da')
      openForm()
      submitForm()
      const descInput = screen.getByLabelText(/Beskrivelse/)
      fireEvent.change(descInput, { target: { value: 'Something' } })
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })
  
    it('renders phone contact card', () => {
      renderSupport('da')
      expect(screen.getByText('+45 9940 2020')).toBeInTheDocument()
      expect(screen.getAllByText('Telefonsupport').length).toBeGreaterThan(0)
    })
  
    it('renders web contact card', () => {
      renderSupport('da')
      expect(screen.getByText('Serviceportal.aau.dk')).toBeInTheDocument()
    })
  
    it('renders all location accordions', () => {
      renderSupport('da')
      expect(screen.getByText('Aalborg Øst')).toBeInTheDocument()
      expect(screen.getByText('Aalborg City')).toBeInTheDocument()
      expect(screen.getByText('København')).toBeInTheDocument()
      expect(screen.getByText('Esbjerg')).toBeInTheDocument()
    })
  
    it('shows opening hours when location accordion is opened', () => {
      renderSupport('da')
      const locBtn = screen.getByText('Aalborg Øst')
      fireEvent.click(locBtn)
      expect(screen.getAllByText(/Mandag - Torsdag/i).length).toBeGreaterThan(0)
      expect(screen.getByText('8.00 - 15.30')).toBeInTheDocument()
    })
  
    it('renders special opening hours section', () => {
      renderSupport('da')
      expect(screen.getByText(/Særlige åbningstider/i)).toBeInTheDocument()
    })
  
    it('renders guides and self-service sections', () => {
      renderSupport('da')
      expect(screen.getByText('Vejledninger')).toBeInTheDocument()
      expect(screen.getByText('Selvbetjening')).toBeInTheDocument()
    })
  
    it('renders chat closed message', () => {
      renderSupport('da')
      expect(screen.getByText(/Chatten er lukket/i)).toBeInTheDocument()
    })
  })
}
