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

test('monkey-patch input to detect if React onChange fires', () => {
  useStore.setState({ lang: 'da' })
  
  // Monkey-patch global input event handler
  let onChangeTriggered = false
  const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'oninput')
  
  // Replace addEventListener on window to catch React's event delegation
  const originalWindowAddEventListener = window.addEventListener.bind(window)
  window.addEventListener = ((type: string, handler: any, options?: any) => {
    if (type === 'input') {
      console.log('Window input listener added by:', handler.toString().substring(0, 200))
    }
    return originalWindowAddEventListener(type, handler, options)
  }) as typeof window.addEventListener
  
  render(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // Let's also intercept React's root container event listener
  const container = document.querySelector('#root') || document.body
  console.log('Root container:', container.tagName)
  
  // Direct check: does the input have a React fiber?
  const fiberKey = Object.keys(subjectInput).find(k => k.startsWith('__reactProps'))
  console.log('React props on input:', fiberKey)
  if (fiberKey) {
    const reactProps = (subjectInput as any)[fiberKey]
    console.log('onChange prop present:', 'onChange' in reactProps)
    console.log('onChange type:', typeof reactProps.onChange)
    console.log('value prop:', reactProps.value)
  }
  
  // Now dispatch the input event and check if React's onChange fires
  console.log('\n--- Dispatching input event ---')
  
  // Try different ways to dispatch the event
  // Method 1: Set value and dispatch native event
  subjectInput.value = 'Method 1'
  const event1 = new Event('input', { bubbles: true, cancelable: true, composed: true })
  console.log('Dispatching native Event...')
  subjectInput.dispatchEvent(event1)
  
  console.log('After Method 1, error calls:', mockToast.error.mock.calls.length)
  
  // Method 2: Use fireEvent.input (which uses createEvent under the hood)
  console.log('\n--- Using fireEvent.input ---')
  subjectInput.value = ''
  fireEvent.input(subjectInput, { target: { value: 'Method 2' } })
  
  console.log('After Method 2 DOM value:', subjectInput.value)
  
  // Check if the React onChange handler fired
  // We know it fired if the React state was updated
  // Let's check by submitting
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('After submit, error calls:', mockToast.error.mock.calls.length)
  console.log('If error == 0, onChange DID fire. If error == 1, onChange did NOT fire.')
})
