import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Grades from '@/pages/Grades'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'
import { translations } from '@/lib/translations'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderGrades(lang: 'da' | 'en' = 'da') {
  useStore.setState({
    lang,
    t: (key: string) => {
      const val = (translations as any)[lang]?.[key]
      return typeof val === 'string' ? val : key
    },
  })
  return render(
    <MemoryRouter>
      <Grades />
    </MemoryRouter>
  )
}

describe('Grades', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders in Danish', () => {
    renderGrades('da')
    expect(screen.getByText(/Karakterer/i)).toBeInTheDocument()
    expect(screen.getByText(/Vægtet GSN/i)).toBeInTheDocument()
  })

  it('renders in English', () => {
    renderGrades('en')
    expect(screen.getByText(/Grades/i)).toBeInTheDocument()
    expect(screen.getByText(/Weighted GPA/i)).toBeInTheDocument()
  })

  it('renders breadcrumb with dashboard link', () => {
    renderGrades('da')
    const breadcrumbs = useStore.getState().breadcrumbs
    expect(breadcrumbs).toEqual([
      { label: 'Dashboard', href: '/' },
      { label: 'Karakterer' },
    ])
  })
})
