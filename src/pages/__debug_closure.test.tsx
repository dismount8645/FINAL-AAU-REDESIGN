import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { test, expect } from 'vitest'

// Input component matching project structure
const Input = React.forwardRef<HTMLInputElement, any>(({ error, ...props }, ref) => {
  return <input ref={ref} aria-invalid={error} {...props} />
})
Input.displayName = 'Input'

function TestForm() {
  const [subject, setSubject] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit - subject:', JSON.stringify(subject))
    if (!subject.trim()) {
      console.log('validation FAILED')
      return
    }
    console.log('validation PASSED')
    setSubmitted(true)
  }

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Skriv en besked</button>
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="subj">Emne</label>
      <Input
        id="subj"
        value={subject}
        onChange={(e: any) => {
          console.log('onChange called with:', JSON.stringify(e.target.value), 'current subject:', JSON.stringify(subject))
          setSubject(e.target.value)
          console.log('after setSubject, subject still:', JSON.stringify(subject))
        }}
      />
      <div data-testid="display">{subject}</div>
      <div data-testid="submitted">{String(submitted)}</div>
      <button type="submit">Send</button>
    </form>
  )
}

test('verify closure behavior', () => {
  render(React.createElement(TestForm))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  const input = screen.getByLabelText('Emne')
  
  console.log('\n--- fireEvent.input ---')
  fireEvent.input(input, { target: { value: 'Hello' } })
  
  console.log('\n--- fireEvent.submit ---')
  fireEvent.submit(document.querySelector('form')!)
  
  console.log('\n--- display after submit ---')
  console.log('display text:', screen.getByTestId('display').textContent)
  console.log('submitted:', screen.getByTestId('submitted').textContent)
  
  expect(screen.getByTestId('submitted').textContent).toBe('true')
})
