import { renderWithProviders, screen, fireEvent, act } from '@/test/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Support from '@/pages/Support'
import useStore from '@/store/useStore'

const mockToast = { error: vi.fn(), success: vi.fn(), info: vi.fn() }

vi.mock('@/context/ToastContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ToastContext')>('@/context/ToastContext')
  return {
    ...actual,
    useToast: () => mockToast,
  }
})

function renderSupport(lang: 'da' | 'en' = 'da') {
  useStore.setState({ lang })
  return renderWithProviders(<Support />)
}

function openForm() {
  act(() => { fireEvent.click(screen.getByText('Skriv en besked')) })
}

function openFormEnglish() {
  act(() => { fireEvent.click(screen.getByText('Write a message')) })
}

function fillFields(subject: string, description: string) {
  const subjectInput = screen.getByLabelText(/Emne|Subject/)
  const descInput = screen.getByLabelText(/Beskrivelse|Description/)
  console.log('fillFields - subjectInput:', subjectInput.tagName, 'id:', subjectInput.id, 'value:', subjectInput.value)
  console.log('fillFields - descInput:', descInput.tagName, 'id:', descInput.id, 'value:', descInput.value)
  act(() => { fireEvent.change(subjectInput, { target: { value: subject } }) })
  act(() => { fireEvent.change(descInput, { target: { value: description } }) })
  console.log('fillFields AFTER change - subjectInput value:', subjectInput.value)
  console.log('fillFields AFTER change - descInput value:', descInput.value)
}

function submitForm() {
  const form = document.querySelector('form')
  if (form) act(() => { fireEvent.submit(form) })
}

describe('Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders correctly in Danish', () => {
    renderSupport('da')
    console.log("t('support_page_title') =", useStore.getState().t('support_page_title'))
    console.log("t('support_fill_all') =", useStore.getState().t('support_fill_all'))
    console.log("t('support.page_title') =", useStore.getState().t('support.page_title'))
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
    openFormEnglish()
    submitForm()
    expect(mockToast.error).toHaveBeenCalledWith('Please fill in all fields')
  })

  it('shows success toast when form is submitted with valid fields', async () => {
    vi.useFakeTimers()
    renderSupport('da')
    openForm()
    fillFields('Test emne', 'Test beskrivelse')
    submitForm()
    await vi.advanceTimersByTimeAsync(1500)
    expect(mockToast.success).toHaveBeenCalledWith('Besked sendt!')
    vi.useRealTimers()
  })

  it('shows success toast in English', async () => {
    vi.useFakeTimers()
    renderSupport('en')
    openFormEnglish()
    fillFields('Test subject', 'Test description')
    submitForm()
    await vi.advanceTimersByTimeAsync(1500)
    expect(mockToast.success).toHaveBeenCalledWith('Message sent!')
    vi.useRealTimers()
  })

  it('closes form after successful submission', async () => {
    vi.useFakeTimers()
    renderSupport('da')
    openForm()
    fillFields('Test emne', 'Test beskrivelse')
    submitForm()
    await vi.advanceTimersByTimeAsync(1500)
    expect(screen.queryByLabelText(/Emne/)).not.toBeInTheDocument()
    expect(screen.getByText('Skriv en besked')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows submitting text while form is being sent', () => {
    renderSupport('da')
    openForm()
    fillFields('Test emne', 'Test beskrivelse')
    expect(mockToast.error).not.toHaveBeenCalled()
    submitForm()
    expect(mockToast.error).not.toHaveBeenCalled()
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
