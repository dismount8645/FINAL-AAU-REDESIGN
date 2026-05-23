import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import React from 'react'
import { test, expect, vi } from 'vitest'
import useStore from '@/store/useStore'
import Support from '@/pages/Support'

// NO MOCKS

test('userEvent.type works on Support without mocks', async () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  const user = userEvent.setup()
  await user.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  
  await user.type(subjectInput, 'Hello', { delay: 0 })
  
  console.log('After type - value:', subjectInput.value)
}, 15000)

test('fireEvent.input works on Support without mocks', () => {
  useStore.setState({ lang: 'da' })
  renderWithProviders(React.createElement(Support))
  
  fireEvent.click(screen.getByText('Skriv en besked'))
  
  const subjectInput = screen.getByLabelText(/Emne/) as HTMLInputElement
  
  fireEvent.input(subjectInput, { target: { value: 'Hello' } })
  
  console.log('After input - value:', subjectInput.value)
})
