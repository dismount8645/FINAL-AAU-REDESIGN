

import { MemoryRouter } from 'react-router-dom';
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

if (import.meta.vitest) {
  describe('Footer Component', () => {
    beforeEach(() => {
      useStore.setState({ lang: 'da' })
    })
  
    const renderFooter = () => {
      return render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      )
    }
  
    it('renders its support link in navigation', () => {
      renderFooter()
      expect(screen.getByText('ITS Support')).toBeInTheDocument()
    })
  
    it('renders accessibility statement link', () => {
      renderFooter()
      expect(screen.getByText('Tilgængelighedserklæring')).toBeInTheDocument()
    })
  
    it('renders service status button', () => {
      renderFooter()
      expect(screen.getByText('Serviceinfo')).toBeInTheDocument()
    })

    it('clicks service status button', () => {
      renderFooter()
      fireEvent.click(screen.getByText('Serviceinfo'))
    })
  
    it('renders copyright', () => {
      renderFooter()
      expect(screen.getByText((content) => content.includes('Aalborg Universitet. Alle rettigheder forbeholdes.'))).toBeInTheDocument()
    })
  
    it('renders correct translations when language is English', () => {
      useStore.setState({ lang: 'en' })
      renderFooter()
      expect(screen.getByText('Accessibility Statement')).toBeInTheDocument()
      expect(screen.getByText('Service Status')).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes('Aalborg Universitet. All rights reserved.'))).toBeInTheDocument()
    })
  })
}
