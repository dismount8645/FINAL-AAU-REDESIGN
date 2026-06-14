import { useState } from 'react';

import { Phone, Globe } from 'lucide-react';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import { InfoCard } from '@/components/ui';
import PageLayout from '@/components/Layout/PageLayout';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { useToast } from '@/components/ui/Toast';
import { submitSupportTicket } from '@/lib/api';
import useStore from '@/store';
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
              <Grid>
                <Grid.Item span={6}>
                  <a href="tel:+4599402020" title={t('click_to_call')} className="block rounded-[var(--radius-lg)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer">
                    <InfoCard
                      icon={Phone}
                      iconBg="transparent"
                      iconColor="var(--color-primary)"
                      iconSize={60}
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
                      iconSize={60}
                      title="Serviceportal"
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

