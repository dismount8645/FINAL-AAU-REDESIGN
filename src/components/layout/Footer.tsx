import Stack from '@/components/ui/Stack'
import { Heading, Text } from '@/components/ui/Typography'
import useStore from '@/store/useStore'

function Footer() {
  const t = useStore(state => state.t)
  return (
    <footer className="footer-main py-[var(--space-xl)] border-t border-[var(--border-color)] bg-[var(--bg-footer)] relative z-10 w-full overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-[var(--space-xl)]">
          {/* Support Card - Left Anchor */}
          <Stack gap="sm" className="bg-[var(--bg-card)] p-[var(--space-lg)] rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-sm)] max-w-[420px] w-full isolate relative overflow-hidden group/footer-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--aau-blue)] opacity-60" />
            <Heading level={4} className="font-bold text-[var(--text-main)] transition-colors group-hover/footer-card:text-[var(--aau-blue)]">
              {t('contact_its_support')}
            </Heading>
            <Stack gap="xs">
              <Text size="sm" weight="bold" className="text-[var(--text-main)]">
                Tel: <a href="tel:+4599402020" className="text-[var(--aau-blue)] hover:underline decoration-2 underline-offset-4">+45 9940 2020</a>
              </Text>
              <Text size="xs" muted weight="medium" className="opacity-80">
                {t('aau_it_services')}
              </Text>
            </Stack>
          </Stack>
          
          {/* Navigation & Copyright - Right Anchor */}
          <Stack gap="lg" align="start" className="md:items-end flex-1">
            <nav className="flex flex-col md:flex-row gap-[var(--space-md)] md:gap-[var(--space-xl)] items-start md:items-center">
              <a href="https://www.its.aau.dk" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--aau-blue)] transition-all duration-200 underline-offset-8 hover:underline decoration-2">
                <Text size="sm" weight="bold">ITS Support</Text>
              </a>
              <a href="https://www.was.digst.dk/aau-dk" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--aau-blue)] transition-all duration-200 underline-offset-8 hover:underline decoration-2">
                <Text size="sm" weight="bold">{t('accessibility_statement')}</Text>
              </a>
              <button onClick={(e) => e.preventDefault()} className="text-[var(--text-muted)] hover:text-[var(--aau-blue)] transition-all duration-200 underline-offset-8 hover:underline decoration-2 bg-transparent border-none p-0 cursor-pointer">
                <Text size="sm" weight="bold">{t('service_status')}</Text>
              </button>
            </nav>
            
            <div className="w-full h-px bg-[var(--border-color)]/20 md:w-48" />
            
            <Text size="xs" muted className="opacity-60 font-medium text-left md:text-right leading-relaxed">
              &copy; {new Date().getFullYear()} Aalborg Universitet. {t('rights_reserved')}
              <br />
              <span className="text-[10px] uppercase tracking-widest font-black text-[var(--aau-blue)]/40 mt-1 block">Vibe Coder Optimized &bull; 2024</span>
            </Text>
          </Stack>
        </div>
      </div>
    </footer>
  )
}

export default Footer
