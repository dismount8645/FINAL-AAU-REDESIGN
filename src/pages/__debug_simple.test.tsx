import { render, screen, fireEvent } from '@testing-library/react'
import React, { useState } from 'react'
import { test, expect } from 'vitest'

function TestInput() {
  const [subject, setSubject] = useState('')
  const [submitCount, setSubmitCount] = useState(0)
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitCount(s => s + 1) }}>
      <input
        aria-label="Emne"
        value={subject}
        onChange={(e) => { console.log('onChange called with:', e.target.value); setSubject(e.target.value) }}
      />
      <div data-testid="subject-display">{subject}</div>
      <div data-testid="submit-count">{submitCount}</div>
      <button type="submit">Submit</button>
    </form>
  )
}

test('fireEvent.input triggers onChange', () => {
  render(React.createElement(TestInput))
  
  const input = screen.getByLabelText(/Emne/)
  const display = screen.getByTestId('subject-display')
  
  console.log('initial display:', display.textContent)
  
  fireEvent.input(input, { target: { value: 'Test emne' } })
  
  console.log('after input display:', display.textContent)
  console.log('input.value:', (input as HTMLInputElement).value)
  
  const submitCount = screen.getByTestId('submit-count')
  console.log('submit count before submit:', submitCount.textContent)
  
  const form = document.querySelector('form')!
  fireEvent.submit(form)
  
  console.log('submit count after submit:', submitCount.textContent)
})
