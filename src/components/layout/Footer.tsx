import Stack from '@/components/ui/Stack'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

function Footer() {
  const { t } = useStore()
  return (
    <footer className="footer-main py-lg border-t border-border bg-[var(--bg-footer)] relative z-10 w-full overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-lg">
          <Stack gap="sm" className="bg-card p-md rounded-[var(--radius-xl)] border border-border shadow-[var(--shadow-sm)] max-w-[400px] w-full">
            <Heading level={4} className="font-bold text-main">{t('contact_its_support')}</Heading>
            <Stack gap="xs">
              <Text size="sm" weight="bold">Tel: <a href="tel:+4599402020" className="text-primary hover:underline decoration-2 underline-offset-4">+45 9940 2020</a></Text>
              <Text size="xs" muted weight="medium">{t('aau_it_services')}</Text>
            </Stack>
          </Stack>
          
          <Stack gap="lg" align="start" className="md:items-end">
            <nav className="flex flex-col md:flex-row gap-md md:gap-xl">
              <a href="https://www.its.aau.dk" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors flex items-center gap-sm underline-offset-4 hover:underline">
                <Text size="sm" weight="bold">ITS Support</Text>
              </a>
              <a href="https://www.was.digst.dk/aau-dk" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors flex items-center gap-sm underline-offset-4 hover:underline">
                <Text size="sm" weight="bold">{t('accessibility_statement')}</Text>
              </a>
              <button onClick={(e) => e.preventDefault()} className="text-muted hover:text-primary transition-colors underline-offset-4 hover:underline bg-transparent border-none p-0 cursor-pointer">
                <Text size="sm" weight="bold">{t('service_status')}</Text>
              </button>
            </nav>
            <Text size="xs" muted className="opacity-60 font-medium">
              &copy; {new Date().getFullYear()} Aalborg Universitet. {t('rights_reserved')}
            </Text>
          </Stack>
        </div>
      </div>
    </footer>
  )
}

export default Footer
