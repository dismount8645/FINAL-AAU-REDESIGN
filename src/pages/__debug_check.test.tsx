import { render, screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import React from 'react'
import { test, expect, vi } from 'vitest'
import useStore from '@/store/useStore'

// Monkey-patch handleSendSupport by replacing it in the ContactForm
// Actually, let's patch at the form level
const originalFormSubmit = HTMLFormElement.prototype.submit
const originalAddEventListener = HTMLFormElement.prototype.addEventListener

test('Support fireEvent - check if handleSendSupport sees updated subject', () => {
  useStore.setState({ lang: 'da' })
  
  // We need to intercept the submit handler
  // Let's just use render and check behavior
  
  const Support = (await import('@/pages/Support')).default
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  
  // Add event listener on form to capture submit event
  const form = document.querySelector('form')!
  form.addEventListener('submit', (e) => {
    // Intercept React's onSubmit handler
    // The event target is the form
    console.log('Form submit event captured')
    console.log('e.target:', e.target)
    console.log('subjectInput.value:', subjectInput.value)
    console.log('descInput.value:', descInput.value)
  }, { capture: true })
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('\n--- After input ---')
  console.log('subjectInput.value:', subjectInput.value)
  console.log('descInput.value:', descInput.value)
  console.log('Is form still in DOM?', !!document.querySelector('form'))
  
  // Check React internal state
  const fiberKey = Object.keys(subjectInput).find(k => k.startsWith('__reactFiber'))
  console.log('React fiber found:', !!fiberKey)
  
  fireEvent.submit(form)
  
  console.log('\n--- After submit ---')
  console.log('Is form still in DOM?', !!document.querySelector('form'))
})
