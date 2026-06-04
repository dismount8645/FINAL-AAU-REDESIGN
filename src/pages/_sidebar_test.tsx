import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SupportSidebar } from '@/components/Support'
import useStore from '@/lib/store'

if (import.meta.vitest) {
  describe('SupportSidebar-isolation', () => {
    beforeEach(() => {
      localStorage.clear()
      useStore.setState({ lang: 'da' })
    })

    it('renders Vejledninger', () => {
      render(<SupportSidebar />)
      console.log('HTML:', document.body.innerHTML)
      expect(screen.getByText('Vejledninger')).toBeInTheDocument()
    })
  })
}
