import { memo, useCallback } from 'react'
import { AlertTriangle, Lock, FileText, MessageSquare, Phone, Globe, GraduationCap, ExternalLink, Mail } from 'lucide-react'
import { Card, Heading, Text, Button } from '@/components/ui'
import { SectionHeader } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives'
import useStore from '@/store'

interface TriageOption {
  id: string
  icon: typeof AlertTriangle
  titleDa: string
  titleEn: string
  descDa: string
  descEn: string
  metaDa: string
  metaEn: string
  ctaDa: string
  ctaEn: string
  href?: string
  onClick?: () => void
}

function TriageSection() {
  const t = useStore(state => state.t)
  const lang = useStore(state => state.lang)

  const handleCall = useCallback(() => {
    window.location.href = 'tel:+4599402020'
  }, [])

  const handleServicePortal = useCallback(() => {
    window.open('https://serviceportal.aau.dk', '_blank', 'noopener,noreferrer')
  }, [])

  const handleExamSelfService = useCallback(() => {
    window.open('https://eksamen.aau.dk', '_blank', 'noopener,noreferrer')
  }, [])

  const handleContact = useCallback(() => {
    window.location.href = 'mailto:aau@aau.dk'
  }, [])

  const options: TriageOption[] = [
    {
      id: 'akut',
      icon: AlertTriangle,
      titleDa: 'Akut problem',
      titleEn: 'Urgent issue',
      descDa: 'Adgangsfejl, systemnede, presserende',
      descEn: 'Access errors, system down, urgent',
      metaDa: '+45 9940 2020 · Man–fre 08:00–15:00',
      metaEn: '+45 9940 2020 · Mon–Fri 08:00–15:00',
      ctaDa: 'Ring op',
      ctaEn: 'Call now',
      onClick: handleCall,
    },
    {
      id: 'login',
      icon: Lock,
      titleDa: 'Login eller adgang',
      titleEn: 'Login or access',
      descDa: 'Nulstil password, brugeradministration',
      descEn: 'Reset password, user administration',
      metaDa: 'Kræver AAU login',
      metaEn: 'Requires AAU login',
      ctaDa: 'Åbn portal',
      ctaEn: 'Open portal',
      onClick: handleServicePortal,
    },
    {
      id: 'eksamen',
      icon: GraduationCap,
      titleDa: 'Eksamenssystemer',
      titleEn: 'Exam systems',
      descDa: 'Digital Eksamen, STADS, karakterer',
      descEn: 'Digital Exam, STADS, grades',
      metaDa: '',
      metaEn: '',
      ctaDa: 'Se selvbetjening',
      ctaEn: 'Self-service',
      onClick: handleExamSelfService,
    },
    {
      id: 'ikke-akut',
      icon: MessageSquare,
      titleDa: 'Ikke akut',
      titleEn: 'Non-urgent',
      descDa: 'Svar inden for 1–2 hverdage',
      descEn: 'Reply within 1–2 business days',
      metaDa: '',
      metaEn: '',
      ctaDa: 'Send besked',
      ctaEn: 'Send message',
      onClick: handleContact,
    },
  ]

  return (
    <section className="triage-section">
      <SectionHeader
        title={lang === 'da' ? 'Hvad har du brug for hjælp til?' : 'What do you need help with?'}
        subtitle={lang === 'da' ? 'Vælg den hurtigste vej til hjælp' : 'Choose the fastest way to get help'}
        level={2}
        className="mb-lg"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {options.map((option) => {
          const Icon = option.icon
          return (
            <Card
              key={option.id}
              interactive
              className="transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
              onClick={option.onClick}
            >
              <Card.Body>
                <Stack gap="sm">
                  <Stack direction="row" align="center" gap="sm">
                    <span className="p-xs rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <Heading level={4} className="m-0 text-sm font-semibold">
                      {lang === 'da' ? option.titleDa : option.titleEn}
                    </Heading>
                  </Stack>
                  <Text size="sm" muted className="leading-relaxed">
                    {lang === 'da' ? option.descDa : option.descEn}
                  </Text>
                  {option.metaDa && (
                    <Text size="xs" muted className="leading-relaxed">
                      {lang === 'da' ? option.metaDa : option.metaEn}
                    </Text>
                  )}
                  <div className="mt-auto pt-sm">
                    <Button size="sm" variant="default" className="w-full sm:w-auto">
                      {lang === 'da' ? option.ctaDa : option.ctaEn}
                      {option.id === 'login' || option.id === 'eksamen' ? (
                        <ExternalLink size={14} className="ml-2xs" />
                      ) : null}
                    </Button>
                  </div>
                </Stack>
              </Card.Body>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default memo(TriageSection)
export { TriageSection }
