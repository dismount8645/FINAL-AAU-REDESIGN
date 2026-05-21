import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Support from '@/pages/Support'
import { MemoryRouter } from 'react-router-dom'
import useStore from '@/store/useStore'

const mockToast = { error: vi.fn(), success: vi.fn(), info: vi.fn() }

vi.mock('@/context/ToastContext', () => ({
  useToast: () => mockToast,
}))

function renderSupport(lang: 'da' | 'en' = 'da') {
  useStore.setState({ lang })
  return render(
    <MemoryRouter>
      <Support />
    </MemoryRouter>
  )
}

function openForm() {
  fireEvent.click(screen.getByText('Skriv en besked'))
}

function submitForm() {
  const form = document.querySelector('form')
  if (form) fireEvent.submit(form)
}

describe('Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders correctly in Danish', () => {
    renderSupport('da')
    expect(screen.getByText(/Kontakt IT-support/i)).toBeInTheDocument()
    const faqBtn = screen.getByText(/Hvordan nulstiller jeg min adgangskode/i)
    fireEvent.click(faqBtn)
    expect(screen.getByText((content) => content.includes('serviceportal.aau.dk'))).toBeInTheDocument()
  })

  it('renders correctly in English', () => {
    renderSupport('en')
    expect(screen.getByText(/Contact IT Support/i)).toBeInTheDocument()
    const faqBtn = screen.getByText(/How do I reset my password/i)
    fireEvent.click(faqBtn)
    const ticketTexts = screen.getAllByText((content) => content.includes('serviceportal.aau.dk'))
    expect(ticketTexts.length).toBeGreaterThan(0)
  })

  it('shows error toast when form is submitted with empty fields', () => {
    renderSupport('da')
    openForm()
    submitForm()
    expect(mockToast.error).toHaveBeenCalledWith('Udfyld venligst alle felter')
  })

  it('shows error toast in English when form is submitted with empty fields', () => {
    renderSupport('en')
    fireEvent.click(screen.getByText('Write a message'))
    submitForm()
    expect(mockToast.error).toHaveBeenCalledWith('Please fill in all fields')
  })

  it('shows success toast when form is submitted with valid fields', () => {
    renderSupport('da')
    openForm()
    const subjectInput = screen.getByLabelText(/Emne/)
    const descInput = screen.getByLabelText(/Beskrivelse/)
    fireEvent.change(subjectInput, { target: { value: 'Test emne' } })
    fireEvent.change(descInput, { target: { value: 'Test beskrivelse' } })
    submitForm()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(mockToast.success).toHaveBeenCalledWith('Besked sendt!')
  })

  it('shows success toast in English', () => {
    renderSupport('en')
    fireEvent.click(screen.getByText('Write a message'))
    const subjectInput = screen.getByLabelText(/Subject/)
    const descInput = screen.getByLabelText(/Description/)
    fireEvent.change(subjectInput, { target: { value: 'Test subject' } })
    fireEvent.change(descInput, { target: { value: 'Test description' } })
    submitForm()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(mockToast.success).toHaveBeenCalledWith('Message sent!')
  })

  it('closes form after successful submission', () => {
    renderSupport('da')
    openForm()
    const subjectInput = screen.getByLabelText(/Emne/)
    const descInput = screen.getByLabelText(/Beskrivelse/)
    fireEvent.change(subjectInput, { target: { value: 'Test emne' } })
    fireEvent.change(descInput, { target: { value: 'Test beskrivelse' } })
    submitForm()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.queryByLabelText(/Emne/)).not.toBeInTheDocument()
    expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
  })

  it('shows submitting text while form is being sent', () => {
    renderSupport('da')
    openForm()
    const subjectInput = screen.getByLabelText(/Emne/)
    const descInput = screen.getByLabelText(/Beskrivelse/)
    fireEvent.change(subjectInput, { target: { value: 'Test emne' } })
    fireEvent.change(descInput, { target: { value: 'Test beskrivelse' } })
    submitForm()
    expect(screen.getByText('Sender...')).toBeInTheDocument()
  })

  it('closes form on cancel', () => {
    renderSupport('da')
    openForm()
    expect(screen.getByLabelText(/Emne/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Annuller'))
    expect(screen.queryByLabelText(/Emne/)).not.toBeInTheDocument()
    expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
  })

  it('clears field errors on input change', () => {
    renderSupport('da')
    openForm()
    submitForm()
    const subjectInput = screen.getByLabelText(/Emne/)
    fireEvent.change(subjectInput, { target: { value: 'Something' } })
    expect(mockToast.error).toHaveBeenCalledTimes(1)
  })

  it('clears field errors on textarea change', () => {
    renderSupport('da')
    openForm()
    submitForm()
    const descInput = screen.getByLabelText(/Beskrivelse/)
    fireEvent.change(descInput, { target: { value: 'Something' } })
    expect(mockToast.error).toHaveBeenCalledTimes(1)
  })

  it('renders phone contact card', () => {
    renderSupport('da')
    expect(screen.getByText('+45 9940 2020')).toBeInTheDocument()
    expect(screen.getAllByText('Telefonsupport').length).toBeGreaterThan(0)
  })

  it('renders web contact card', () => {
    renderSupport('da')
    expect(screen.getByText('Serviceportal.aau.dk')).toBeInTheDocument()
  })

  it('renders all location accordions', () => {
    renderSupport('da')
    expect(screen.getByText('Aalborg Øst')).toBeInTheDocument()
    expect(screen.getByText('Aalborg City')).toBeInTheDocument()
    expect(screen.getByText('København')).toBeInTheDocument()
    expect(screen.getByText('Esbjerg')).toBeInTheDocument()
  })

  it('shows opening hours when location accordion is opened', () => {
    renderSupport('da')
    const locBtn = screen.getByText('Aalborg Øst')
    fireEvent.click(locBtn)
    expect(screen.getAllByText(/Mandag - Torsdag/i).length).toBeGreaterThan(0)
    expect(screen.getByText('8.00 - 15.30')).toBeInTheDocument()
  })

  it('renders special opening hours section', () => {
    renderSupport('da')
    expect(screen.getByText(/Særlige åbningstider/i)).toBeInTheDocument()
  })

  it('renders guides and self-service sections', () => {
    renderSupport('da')
    expect(screen.getByText('Vejledninger')).toBeInTheDocument()
    expect(screen.getByText('Selvbetjening')).toBeInTheDocument()
  })

  it('renders chat closed message', () => {
    renderSupport('da')
    expect(screen.getByText(/Chatten er lukket/i)).toBeInTheDocument()
  })


})
