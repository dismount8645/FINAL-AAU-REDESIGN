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

beforeEach(() => { vi.clearAllMocks() })

test('check if onChange is triggered in Support', () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  console.log('subjectInput tagName:', subjectInput.tagName)
  console.log('subjectInput id:', subjectInput.id)
  console.log('descInput tagName:', descInput.tagName)
  console.log('descInput id:', descInput.id)
  
  // Intercept addEventListener to verify if React listens for input events
  const origAddEventListener = subjectInput.addEventListener.bind(subjectInput)
  const inputEvents: any[] = []
  subjectInput.addEventListener = (type: string, handler: any, options?: any) => {
    inputEvents.push({ type, handler: handler.toString().substring(0, 100) })
    return origAddEventListener(type, handler, options)
  }
  
  // Also check the form submit event
  const form = document.querySelector('form')!
  let submitEventCaptured = false
  form.addEventListener('submit', (e) => { 
    submitEventCaptured = true
    console.log('submit event captured at form level')
  })
  
  // Now dispatch input events
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  
  console.log('input events listeners registered:', inputEvents.map(e => e.type))
  console.log('value after input:', subjectInput.value)
  
  // Check if the display value changes
  console.log('subject display in form:', form.innerHTML.includes('value="Test emne"'))
  
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  // Now submit
  fireEvent.submit(form)
  console.log('submit event captured by form listener:', submitEventCaptured)
  
  // After submit, form should close if successful
  console.log('is form still in DOM?', !!document.querySelector('form'))
  console.log('error calls:', mockToast.error.mock.calls.length)
}, 15000)

test('add tiny label inside Support to verify state changes', () => {
  // Let's spy on React state directly
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // BEFORE dispatching any event, let's verify that the 
  // React synthetic onChange handler is installed
  // React uses event delegation on the root, so the input
  // element itself shouldn't have direct event listeners
  
  console.log('input event listeners count:', 
    (eventNames: string[]) => {
      const el = subjectInput
      const proto = Object.getPrototypeOf(el)
      // We can't easily enumerate listeners
      return 'N/A'
    }
  )
  
  // Manually dispatch input event and check all props
  const inputEvent = new Event('input', { bubbles: true, cancelable: true })
  Object.defineProperty(inputEvent, 'target', { 
    writable: false, 
    value: { ...subjectInput, value: 'Manual test' } 
  })
  
  console.log('Dispatching manual input event...')
  subjectInput.dispatchEvent(inputEvent)
  console.log('After manual input - value:', subjectInput.value)
  
  // Also try with just setting value and dispatching
  subjectInput.value = 'Direct set'
  const inputEvent2 = new Event('input', { bubbles: true, cancelable: true })
  subjectInput.dispatchEvent(inputEvent2)
  console.log('After direct set + dispatch - value:', subjectInput.value)
}, 15000)
