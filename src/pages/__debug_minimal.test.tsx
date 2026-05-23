import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { test, expect, vi } from 'vitest'

// Minimal component that mimics ContactForm structure
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
    if (!subject.trim()) return
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
        onChange={(e: any) => { console.log('CHANGE FIRED:', e.target.value); setSubject(e.target.value) }}
      />
      <div data-testid="display">{subject}</div>
      <div data-testid="submitted">{String(submitted)}</div>
      <button type="submit">Send</button>
    </form>
  )
}

test('fireEvent.input with custom Input component', () => {
  render(React.createElement(TestForm))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const input = screen.getByLabelText('Emne')
  const display = screen.getByTestId('display')
  
  console.log('initial display:', display.textContent)
  
  fireEvent.input(input, { target: { value: 'Hello' } })
  
  console.log('after input display:', display.textContent)
  console.log('input value:', (input as HTMLInputElement).value)
  
  fireEvent.submit(document.querySelector('form')!)
  console.log('submitted:', screen.getByTestId('submitted').textContent)
})

test('userEvent.type with custom Input component', async () => {
  const user = userEvent.setup()
  render(React.createElement(TestForm))
  
  await user.click(screen.getByText('Skriv en besked'))
  
  const input = screen.getByLabelText('Emne')
  const display = screen.getByTestId('display')
  
  console.log('initial display:', display.textContent)
  
  await user.type(input, 'Hello', { delay: 0 })
  
  console.log('after type display:', display.textContent)
  console.log('input value:', (input as HTMLInputElement).value)
  
  fireEvent.submit(document.querySelector('form')!)
  console.log('submitted:', screen.getByTestId('submitted').textContent)
})
