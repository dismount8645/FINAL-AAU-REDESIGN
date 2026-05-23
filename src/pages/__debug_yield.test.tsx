import { render, screen, fireEvent, act } from '@testing-library/react'
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

test('fireEvent.click + fireEvent.input + async yield + fireEvent.submit', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  // Yield to microtask queue
  await new Promise(resolve => setTimeout(resolve, 0))
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('yield test  error:', mockToast.error.mock.calls.length)
  console.log('yield test success:', mockToast.success.mock.calls.length)
}, 15000)

test('userEvent.type with delay:null', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  const user = userEvent.setup()
  await user.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  await user.type(subjectInput, 'Test emne', { delay: null })
  await user.type(descInput, 'Test beskrivelse', { delay: null })
  
  console.log('DOM values:', { subject: subjectInput.value, desc: descInput.value })
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('userEvent delay null error:', mockToast.error.mock.calls.length)
  console.log('userEvent delay null success:', mockToast.success.mock.calls.length)
}, 15000)

test('userEvent.type + act submit', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  const user = userEvent.setup()
  await user.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  await user.type(subjectInput, 'Test emne', { delay: 0 })
  await user.type(descInput, 'Test beskrivelse', { delay: 0 })
  
  console.log('DOM values:', { subject: subjectInput.value, desc: descInput.value })
  
  const form = document.querySelector('form')!
  await act(async () => { fireEvent.submit(form) })
  
  console.log('userEvent+act error:', mockToast.error.mock.calls.length)
  console.log('userEvent+act success:', mockToast.success.mock.calls.length)
}, 15000)
