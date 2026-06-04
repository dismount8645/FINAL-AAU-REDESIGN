import { memo } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Phone, Mail, MapPin, ShieldHalf, Monitor, Signal } from 'lucide-react';
import { linkifyText } from './FaqSection';
import FaqSection from './FaqSection';
import LocalDesksSection from './LocalDesksSection';
import ContactForm from './ContactForm';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ListItem from '@/components/ListItem';
import SectionHeader from '@/components/SectionHeader';
import { Stack } from '@/components/LayoutPrimitives';
import { Heading, Text } from '@/components/Typography';
import useStore from '@/lib/store';

interface SupportSidebarProps {
  children?: React.ReactNode
}

function SupportSidebar({ children }: SupportSidebarProps) {
  const t = useStore(state => state.t)

  return (
    <aside className="support-sidebar flex flex-col gap-lg">
      <Card>
        <SectionHeader
          title={t('guides')}
          level={3}
        />
        <Stack gap="2xs">
          {[
            { label: t('guide_overview'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
            { label: t('guide_students'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
            { label: t('guide_teachers'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
            { label: t('guide_staff'), url: 'https://www.en.aau.dk/digital-identity/moodle/' },
          ].map((item, i) => (
            <ListItem key={i} title={item.label} href={item.url} className="text-primary hover:underline underline-offset-2" />
          ))}
        </Stack>
      </Card>

      <Card>
        <SectionHeader
          title={t('self_service')}
          level={3}
        />
        <Stack gap="sm">
          <Button variant="ghost" size="sm" full icon={ShieldHalf} className="justify-start text-primary hover:underline underline-offset-2">
            {t('gdpr_faq')}
          </Button>
          <Button variant="ghost" size="sm" full icon={Monitor} className="justify-start text-primary hover:underline underline-offset-2">
            {t('it_support_portal')}
          </Button>
          <Button variant="ghost" size="sm" full icon={Signal} className="justify-start text-primary hover:underline underline-offset-2">
            {t('system_status')}
          </Button>
        </Stack>
      </Card>

      {children}

      <Card className="bg-subtle">
        <Heading level={3} className="mb-sm text-main">
          <MapPin size={18} strokeWidth={2} className="inline mr-2xs align-text-bottom text-muted" />
          {t('main_office')}
        </Heading>
        <Text size="sm" className="text-muted leading-relaxed">
          Fredrik Bajers Vej 7K<br />
          9220 Aalborg Ø<br />
          <a href="tel:+4599402020" className="text-primary hover:underline flex items-center gap-sm mt-2xs">
            <Phone size={14} strokeWidth={2} /> Tlf.: 9940 2020
          </a>
          <a href="mailto:aau@aau.dk" className="text-primary hover:underline flex items-center gap-sm mt-2xs">
            <Mail size={14} strokeWidth={2} /> aau@aau.dk
          </a>
        </Text>
      </Card>

      <Card variant="brand" className="bg-accent text-white border-none">
        <Heading level={3} className="text-white">{t('chat_is_closed')}</Heading>
        <Text size="xs" muted className="leading-[1.5]">
          {t('chat_is_closed_desc')}
        </Text>
      </Card>
    </aside>
  )
}

export default memo(SupportSidebar)

if (import.meta.vitest) {
  describe('Support Sections Subcomponents', () => {
    beforeEach(() => {
      useStore.setState({ lang: 'da' })
    })
  
    describe('FaqSection', () => {
      it('renders FAQs lists', () => {
        render(<FaqSection />)
        expect(screen.getByText('Ofte stillede spørgsmål')).toBeInTheDocument()
        expect(screen.getByText('Hvordan nulstiller jeg min adgangskode?')).toBeInTheDocument()
      })
    })
  
    describe('LocalDesksSection', () => {
      it('renders desks locations and schedules', () => {
        render(<LocalDesksSection />)
        expect(screen.getByText('Find din lokale servicedesk')).toBeInTheDocument()
        expect(screen.getByText('Aalborg Øst')).toBeInTheDocument()
      })
    })
  
    describe('ContactForm', () => {
      it('renders write a message button by default', () => {
        const setSubject = vi.fn()
        const setDescription = vi.fn()
        const setIsFormOpen = vi.fn()
        const onSubmit = vi.fn()
        const onCancel = vi.fn()
  
        render(
          <ContactForm
            subject=""
            setSubject={setSubject}
            description=""
            setDescription={setDescription}
            isFormOpen={false}
            setIsFormOpen={setIsFormOpen}
            isSubmitting={false}
            fieldErrors={{ subject: false, description: false }}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )
  
        expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Skriv en besked'))
        expect(setIsFormOpen).toHaveBeenCalledWith(true)
      })
  
      it('renders form inputs and handles submission when open', () => {
        const setSubject = vi.fn()
        const setDescription = vi.fn()
        const setIsFormOpen = vi.fn()
        const onSubmit = vi.fn()
        const onCancel = vi.fn()
  
        render(
          <ContactForm
            subject="Test subject"
            setSubject={setSubject}
            description="Test desc"
            setDescription={setDescription}
            isFormOpen={true}
            setIsFormOpen={setIsFormOpen}
            isSubmitting={false}
            fieldErrors={{ subject: false, description: false }}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )
  
        expect(screen.getByDisplayValue('Test subject')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test desc')).toBeInTheDocument()
  
        fireEvent.change(screen.getByLabelText('Emne', { exact: false }), { target: { value: 'New Subject' } })
        expect(setSubject).toHaveBeenCalledWith('New Subject')
  
        const form = screen.getByRole('button', { name: 'Send besked' }).closest('form')
        fireEvent.submit(form!)
        expect(onSubmit).toHaveBeenCalled()
      })
    })
  
    describe('SupportSidebar', () => {
      it('renders sidebar lists and child elements', () => {
        render(
          <SupportSidebar>
            <div data-testid="child">Child component</div>
          </SupportSidebar>
        )
  
        expect(screen.getByText('Vejledninger')).toBeInTheDocument()
        expect(screen.getByText('Selvbetjening')).toBeInTheDocument()
        expect(screen.getByTestId('child')).toBeInTheDocument()
      })
    })
  
    it('linkifyText handles non-http links', () => {
      render(<>{linkifyText('see support.its.aau.dk or http://test.com')}</>)
      const link = screen.getByText('support.its.aau.dk')
      expect(link).toHaveAttribute('href', 'https://support.its.aau.dk')
    })
  })
}
