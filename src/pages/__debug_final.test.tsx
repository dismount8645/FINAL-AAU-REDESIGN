import { render, screen, fireEvent, act } from '@testing-library/react'
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

test('act fireEvent.input + act fireEvent.submit', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  // Open form
  act(() => { fireEvent.click(screen.getByText('Skriv en besked')) })
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // Fill fields with act wrapper
  act(() => { fireEvent.input(subjectInput, { target: { value: 'Test emne' } }) })
  act(() => { fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } }) })
  
  console.log('DOM value after act fireEvent.input:', { subject: subjectInput.value, desc: descInput.value })
  
  // Submit with act wrapper
  const form = document.querySelector('form')!
  act(() => { fireEvent.submit(form) })
  
  console.log('mockToast.error calls:', mockToast.error.mock.calls.length)
  console.log('mockToast.success calls:', mockToast.success.mock.calls.length)
}, 15000)

test('await act(async () => fireEvent.input(...)) + await act(async () => fireEvent.submit(...))', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  // Open form with await act
  await act(async () => { fireEvent.click(screen.getByText('Skriv en besked')) })
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // Fill fields with await act
  await act(async () => { fireEvent.input(subjectInput, { target: { value: 'Test emne' } }) })
  await act(async () => { fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } }) })
  
  console.log('DOM value after await act fireEvent.input:', { subject: subjectInput.value, desc: descInput.value })
  
  // Submit with await act
  const form = document.querySelector('form')!
  await act(async () => { fireEvent.submit(form) })
  
  console.log('mockToast.error calls:', mockToast.error.mock.calls.length)
  console.log('mockToast.success calls:', mockToast.success.mock.calls.length)
}, 15000)

test('await act(() => fireEvent.input) + await act(() => fireEvent.submit) - sync callbacks', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  await act(() => { fireEvent.click(screen.getByText('Skriv en besked')) })
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  await act(() => { fireEvent.input(subjectInput, { target: { value: 'Test emne' } }) })
  await act(() => { fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } }) })
  
  console.log('DOM value:', { subject: subjectInput.value, desc: descInput.value })
  
  const form = document.querySelector('form')!
  await act(() => { fireEvent.submit(form) })
  
  console.log('mockToast.error calls:', mockToast.error.mock.calls.length)
  console.log('mockToast.success calls:', mockToast.success.mock.calls.length)
}, 15000)
