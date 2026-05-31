import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DynamicWaveBackground from '@/components/layout/DynamicWaveBackground'
import useStore from '@/store/useStore'

function renderAtPath(pathname: string, isDarkMode = false) {
  useStore.setState({ isDarkMode })
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="*" element={<DynamicWaveBackground />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DynamicWaveBackground', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a wave image', () => {
    const { container } = renderAtPath('/')
    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-01.webp')
  })

  it('uses exact path match', () => {
    const { container } = renderAtPath('/courses')
    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-02.webp')
  })

  it('uses prefix path match', () => {
    const { container } = renderAtPath('/course/123')
    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-07.webp')
  })

  it('uses fallback when no path matches', () => {
    const { container } = renderAtPath('/some-random-path')
    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-10.webp')
  })

  it('uses dark mode URL when isDarkMode is true', () => {
    const { container } = renderAtPath('/', true)
    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el.style.backgroundImage).toContain('AAU_BOELGER_WHITE-01.webp')
  })

  it('handles image load and transition', () => {
    let loadHandler: (() => void) | null = null
    const originalImage = globalThis.Image
    globalThis.Image = class {
      set onload(fn: () => void) { loadHandler = fn }
      set src(_: string) { /* start loading */ }
    } as any

    const { container } = renderAtPath('/')
    
    // Trigger load
    act(() => {
      if (loadHandler) loadHandler()
    })

    const el = container.querySelector('.dynamic-waves') as HTMLElement
    expect(el.style.opacity).toBe('0.15')
    
    globalThis.Image = originalImage
  })

  it('returns null when image fails to load', () => {
    const originalImage = globalThis.Image
    globalThis.Image = class {
      onerror: (() => void) | null = null
      set src(_: string) {
        act(() => { this.onerror?.() })
      }
    } as any

    const { container } = renderAtPath('/')
    expect(container.querySelector('.dynamic-waves')).not.toBeInTheDocument()

    globalThis.Image = originalImage
  })
})
