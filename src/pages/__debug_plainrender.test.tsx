import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { test, expect, vi, beforeEach } from 'vitest'
import useStore from '@/store/useStore'
import Support from '@/pages/Support'

const mockToast = { error: vi.fn(), success: vi.fn(), info: vi.fn() }

vi.mock('@/api/support', async () => {
  const actual = await vi.importActual<typeof import('@/api/support')>('@/api/support')
  return { ...actual, submitSupportTicket: vi.fn().mockResolvedValue({ success: true }) }
})

vi.mock('@/context/ToastContext', async () => {
  const actual = await vi.importActual<typeof import('@/context/ToastContext')>('@/context/ToastContext')
  return { ...actual, useToast: () => mockToast }
})

beforeEach(() => { vi.clearAllMocks() })

test('PLAIN render - fireEvent.input + fireEvent.submit', () => {
  useStore.setState({ lang: 'da' })
  // Use plain render, NOT renderWithProviders
  render(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('subject DOM value:', subjectInput.value)
  
  const form = document.querySelector('form')
  console.log('form found:', !!form)
  
  if (form) {
    fireEvent.submit(form)
  }
  
  console.log('error calls:', mockToast.error.mock.calls.length)
  console.log('success calls:', mockToast.success.mock.calls.length)
})
