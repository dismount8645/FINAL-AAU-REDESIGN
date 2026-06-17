
import Button from '@/components/ui/Button';
import { Text } from '@/components/ui';
import useStore from '@/store';

function Footer() {
  const t = useStore(state => state.t)
  return (
    <footer className="footer-main py-md border-t border-border/40 bg-bg-body relative z-10 w-full overflow-hidden">
      <div className="w-full px-[var(--space-md)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm w-full">
          <nav className="flex flex-wrap gap-x-md gap-y-2xs items-center">
            <a href="https://www.its.aau.dk" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-primary transition-all duration-150 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">
              <Text size="sm" weight="bold">ITS Support</Text>
            </a>
            <span className="text-border/60 text-sm hidden sm:inline">&bull;</span>
            <a href="https://www.was.digst.dk/aau-dk" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-primary transition-all duration-150 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">
              <Text size="sm" weight="bold">{t('accessibility_statement')}</Text>
            </a>
            <span className="text-border/60 text-sm hidden sm:inline">&bull;</span>
            <Button
              variant="ghost"
              onClick={(e) => e.preventDefault()}
              className="text-text-secondary hover:text-primary transition-all duration-150 h-auto p-0 min-h-[36px] inline-flex items-center bg-transparent hover:bg-transparent font-bold normal-case tracking-normal text-sm focus-visible:outline-none focus-visible:shadow-focus"
            >
              {t('service_status')}
            </Button>
          </nav>
          
          <Text size="sm" className="text-text-secondary font-medium text-left md:text-right leading-none shrink-0">
            &copy; {new Date().getFullYear()} Aalborg Universitet. {t('rights_reserved')}
          </Text>
        </div>
      </div>
    </footer>
  )
}

export default Footer

