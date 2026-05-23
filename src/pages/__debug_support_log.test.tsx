import { render, screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import React from 'react'
import { test, expect, vi } from 'vitest'
import useStore from '@/store/useStore'
import Support from '@/pages/Support'

test('Support fireEvent - intercept form submit', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  const descInput = screen.getByLabelText(/Beskrivelse/) as HTMLTextAreaElement
  const form = document.querySelector('form')!
  
  // Add capturing listener on form to spy on submit event
  form.addEventListener('submit', (e) => {
    console.log('FORM SUBMIT CAPTURED')
    console.log('Calling preventDefault to stop React handler')
    // Don't prevent default, just observe
  }, { capture: true })
  
  fireEvent.input(subjectInput, { target: { value: 'Test emne' } })
  fireEvent.input(descInput, { target: { value: 'Test beskrivelse' } })
  
  console.log('DOM values after input:', { 
    subject: subjectInput.value, 
    desc: descInput.value 
  })
  
  // Check the React-controlled display value
  // We can check if re-render happened by looking for a new subject prop in the tree
  console.log('form children:', form.children.length)
  console.log('Form still open:', !!document.querySelector('form'))
  
  // Let's manually check if the input element has the correct value
  // React controlled inputs get their value from React state, so if the value
  // was updated by React, checking the DOM value should reflect React's state
  
  // Wait, React controlled inputs set value from state in the render.
  // If React re-rendered after setSubject('Test emne'), then the DOM value
  // would be set to 'Test emne' by React's render.
  // But fireEvent.input already set input.value = 'Test emne' directly.
  // So the DOM value doesn't tell us if React re-rendered.
  
  // Better approach: check if the submit handler sees the right value
  // by wrapping React's submit handler
  console.log('\n--- Submitting form ---')
  fireEvent.submit(form)
  
  // If submit was successful, the form should close (isFormOpen = false)
  // So checking if form still exists tells us if validation passed
  console.log('Form still in DOM after submit:', !!document.querySelector('form'))
  console.log('Any error text visible:', screen.queryByText('Udfyld venligst alle felter'))
})
