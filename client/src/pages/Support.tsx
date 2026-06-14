import { useState } from 'react';

import { Phone, Globe } from 'lucide-react';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { InfoCard } from '@/components/ui';
import PageLayout from '@/components/Layout/PageLayout';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { useToast } from '@/components/ui/Toast';
import { submitSupportTicket } from '@/lib/api';
import useStore from '@/store';
import TriageSection from '@/components/Support/TriageSection';
import { FaqSection, LocalDesksSection, ContactForm, SupportSidebar } from '@/components/Support';

function Support() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)
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
    try {
      await submitSupportTicket({ subject, description })
      toast.success(t('support.message_sent'))
      setSubject('')
      setDescription('')
      setIsFormOpen(false)
    } catch {
      toast.error(t('support.error'))
    } finally {
      setIsSubmitting(false)
    }
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

      <div className="container pb-lg">
        <Grid>
          <Grid.Item span={7}>
            <Stack gap="md">
              <TriageSection />
              <Grid>
                <Grid.Item span={6}>
                    <a href="tel:+4599402020" title={t('click_to_call')} className="block rounded-[var(--radius-lg)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer">
                    <InfoCard
                      icon={Phone}
                      iconBg="transparent"
                      iconColor="var(--color-primary)"
                      iconSize={60}
                      title={lang === 'da' ? 'Ring til IT-support' : 'Call IT Support'}
                      subtitle={lang === 'da' ? 'Akutte problemer og adgangsfejl' : 'Urgent issues and access problems'}
                      description={'+45 9940 2020 · ' + (lang === 'da' ? 'Man–fre 08:00–15:00' : 'Mon–Fri 08:00–15:00')}
                    />
                  </a>
                </Grid.Item>
                <Grid.Item span={6}>
                    <a href="https://serviceportal.aau.dk" target="_blank" rel="noopener noreferrer" className="block rounded-[var(--radius-lg)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer">
                    <InfoCard
                      icon={Globe}
                      iconBg="transparent"
                      iconColor="var(--color-success)"
                      iconSize={60}
                      title={lang === 'da' ? 'Åbn serviceportal' : 'Open Service Portal'}
                      subtitle={lang === 'da' ? 'Opret og følg supportsager' : 'Create and track support tickets'}
                      description={t('requires_aau_login')}
                    />
                  </a>
                </Grid.Item>
              </Grid>

              <FaqSection />

              <LocalDesksSection />
            </Stack>
          </Grid.Item>

          <Grid.Item span={5} className="min-w-0 overflow-visible">
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

