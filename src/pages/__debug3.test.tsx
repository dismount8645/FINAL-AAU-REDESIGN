import { render, screen, fireEvent } from '@testing-library/react'  
import userEvent from '@testing-library/user-event'
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

test('fireEvent.input triggers React onChange', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  // Open form
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // Test fireEvent.input
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('DOM value after fireEvent.input:', { subject: subjectInput.value, desc: descInput.value })
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('mockToast.error calls:', mockToast.error.mock.calls.length)
})
