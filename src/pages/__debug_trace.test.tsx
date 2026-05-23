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

vi.mock('@/api/support', async () => {
  const actual = await vi.importActual<typeof import('@/api/support')>('@/api/support')
  return { ...actual, submitSupportTicket: vi.fn().mockResolvedValue({ success: true }) }
})

beforeEach(() => { vi.clearAllMocks() })

test('trace full flow with fireEvent.input on Support', () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  // Open form
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  console.log('before input - subjectInput.value:', subjectInput.value)
  
  // Intercept React's change handler
  const originalDefineProperty = Object.defineProperty
  // @ts-ignore
  const origAddEventListener = HTMLInputElement.prototype.addEventListener
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  
  console.log('after input - subjectInput.value:', subjectInput.value)
  console.log('after input - subjectInput._valueTracker:', (subjectInput as any)._valueTracker)
  
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('after desc input - descInput.value:', descInput.value)
  
  // Let's see what the DOM shows
  console.log('all inputs:', document.querySelectorAll('input').length)
  console.log('all textareas:', document.querySelectorAll('textarea').length)
  
  const form = document.querySelector('form')
  console.log('form found:', !!form)
  
  if (form) {
    console.log('form innerHTML contains subject:', form.innerHTML.includes('support-subject'))
    fireEvent.submit(form)
  }
  
  console.log('error calls:', mockToast.error.mock.calls.length)
  console.log('success calls:', mockToast.success.mock.calls.length)
})
