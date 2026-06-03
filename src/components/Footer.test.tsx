import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Footer from '@/components/Footer'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'

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

  it('renders support card with contact info in Danish', () => {
    renderFooter()
    expect(screen.getByText('Kontakt ITS Support')).toBeInTheDocument()
    expect(screen.getByText('+45 9940 2020')).toBeInTheDocument()
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

  it('renders copyright and brand signature', () => {
    renderFooter()
    expect(screen.getByText((content) => content.includes('Aalborg Universitet. Alle rettigheder forbeholdes.'))).toBeInTheDocument()
    expect(screen.getByText(/Vibe Coder Optimized/i)).toBeInTheDocument()
  })

  it('renders correct translations when language is English', () => {
    useStore.setState({ lang: 'en' })
    renderFooter()
    expect(screen.getByText('Contact ITS Support')).toBeInTheDocument()
    expect(screen.getByText('Accessibility Statement')).toBeInTheDocument()
    expect(screen.getByText('Service Status')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('Aalborg Universitet. All rights reserved.'))).toBeInTheDocument()
  })
})
