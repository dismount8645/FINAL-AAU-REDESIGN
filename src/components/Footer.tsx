import Stack from '@/components/Stack'
import { Heading, Text } from '@/components/Typography'
import useStore from '@/store/useStore'
import Button from '@/components/Button'

function Footer() {
  const t = useStore(state => state.t)
  return (
    <footer className="footer-main py-xl border-t border-border bg-bg-card relative z-10 w-full overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Support Card - Left Anchor */}
          <Stack gap="sm" className="bg-bg-card p-lg rounded-xl border border-border shadow-sm col-span-12 md:col-span-5 lg:col-span-4 w-full isolate relative overflow-hidden group/footer-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-60" />
            <Heading level={2} as="h2" className="font-bold text-main transition-colors group-hover/footer-card:text-primary text-lg">
              {t('contact_its_support')}
            </Heading>
            <Stack gap="xs">
              <Text size="sm" weight="bold" className="text-main">
                Tel: <a href="tel:+4599402020" className="text-primary hover:text-accent hover:underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">+45 9940 2020</a>
              </Text>
            <Text size="xs" className="text-text-muted" weight="medium">
                {t('aau_it_services')}
              </Text>
            </Stack>
          </Stack>
          
          {/* Navigation & Copyright - Right Anchor */}
          <Stack gap="lg" className="items-start md:items-end col-span-12 md:col-span-7 lg:col-span-8 w-full">
            <nav className="flex flex-col md:flex-row gap-md md:gap-xl items-start md:items-center">
              <a href="https://www.its.aau.dk" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-all duration-150 underline-offset-8 hover:underline decoration-2 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">
                <Text size="sm" weight="bold">ITS Support</Text>
              </a>
              <a href="https://www.was.digst.dk/aau-dk" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-all duration-150 underline-offset-8 hover:underline decoration-2 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">
                <Text size="sm" weight="bold">{t('accessibility_statement')}</Text>
              </a>
              <Button
                variant="ghost"
                onClick={(e) => e.preventDefault()}
                className="text-text-muted hover:text-primary transition-all duration-150 underline-offset-8 hover:underline decoration-2 h-auto p-0 min-h-[44px] inline-flex items-center bg-transparent hover:bg-transparent font-bold normal-case tracking-normal text-sm focus-visible:outline-none focus-visible:shadow-focus"
              >
                {t('service_status')}
              </Button>
            </nav>
            
            <div className="w-full h-px bg-border/20 md:w-48" />
            
            <Text size="xs" className="text-text-muted font-medium text-left md:text-right leading-relaxed">
              &copy; {new Date().getFullYear()} Aalborg Universitet. {t('rights_reserved')}
              <br />
              <span className="text-[10px] uppercase tracking-widest font-black text-white/50 mt-1 block">Vibe Coder Optimized &bull; {new Date().getFullYear()}</span>
            </Text>
          </Stack>
        </div>
      </div>
    </footer>
  )
}

export default Footer
