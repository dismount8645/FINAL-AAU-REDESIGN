import { useState } from 'react'
import { Phone, Globe } from 'lucide-react'
import { useToast } from '@/components/Toast'
import PageHeader from '@/components/PageHeader'
import Grid from '@/components/Grid'
import Stack from '@/components/Stack'
import InfoCard from '@/components/InfoCard'
import useStore from '@/lib/store'
import { submitSupportTicket } from '@/lib/api'
import {
  FaqSection,
  LocalDesksSection,
  ContactForm,
  SupportSidebar,
} from '@/components'

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
      toast.error(t('support_fill_all'))
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      void submitSupportTicket({ subject, description }).catch(() => {
        toast.error(t('support_error'))
      })
      toast.success(t('support_message_sent'))
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
    <Stack className="support-page relative animate-fade-in">
      <PageHeader
        flat
        pageKey="support"
        title={t('support_page_title')}
        subtitle={t('support_page_subtitle')}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('support') },
        ]}
      />

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
    </Stack>
  )
}

export default Support
