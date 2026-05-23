import { render, screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import React from 'react'
import { test, expect, vi, beforeEach } from 'vitest'
import useStore from '@/store/useStore'
import Support from '@/pages/Support'

const mockToast = { error: vi.fn(), success: vi.fn(), info: vi.fn() }

vi.mock('@/context/ToastContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ToastContext')>('@/context/ToastContext')
  return { ...actual, useToast: () => mockToast }
})

beforeEach(() => { vi.clearAllMocks() })

test('fireEvent.input + fireEvent.submit with mocks', () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('Before submit - subject value:', subjectInput.value)
  console.log('Before submit - desc value:', descInput.value)
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('After submit - error:', mockToast.error.mock.calls.length)
  console.log('After submit - success:', mockToast.success.mock.calls.length)
  
  // If successful, form should close
  console.log('Form in DOM after submit:', !!document.querySelector('form'))
})

test('fireEvent.input + fireEvent.submit - submit then check state', () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  
  // After fireEvent.input, check React re-rendered by checking for specific DOM changes
  // The ContactForm re-renders with new subject prop
  // Since subject is a controlled value, React sets input.value from state
  // But we already set it via fireEvent.input
  // Instead, check if the form is still the same (no change detection)
  
  // Let's just check if there's an error state change
  console.log('fieldErrors present:', screen.queryByText(/Udfyld venligst/))
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('After submit:')
  console.log('error calls:', mockToast.error.mock.calls.length)
  console.log('success calls:', mockToast.success.mock.calls.length)
  console.log('form in DOM:', !!document.querySelector('form'))
  
  // If validation passed (subject was updated), form stays open until setTimeout completes
  // Actually, form only closes after setTimeout(1000) completes AND submitSupportTicket resolves
  // So after submit, form stays open, isSubmitting = true
  // The submit button should show "Sender..."
  
  if (document.querySelector('form')) {
    console.log('submit button text:', screen.getByRole('button', { name: /Sender|Send/ })?.textContent)
  }
})
