import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Submission from '@/pages/Submission'
import { renderWithProviders } from '@/test/test-utils'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ courseId: '1', assignmentId: '105' })
  }
})

describe('Submission Page', () => {
  it('handles file upload', () => {
    renderWithProviders(<Submission />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: [file] } })
    expect(screen.getByText('hello.png')).toBeInTheDocument()
  })

  it('handles invalid file input (no files selected)', () => {
    renderWithProviders(<Submission />)
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: null } })
    expect(screen.queryByText('hello.png')).not.toBeInTheDocument()
  })

  it('handles file processing error (e.g. non-file object in file list)', () => {
    renderWithProviders(<Submission />)
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    
    // Create aFileList-like object that isn't empty but lacks expected file structure
    const invalidFiles = {
      item: () => null,
      length: 1,
      0: {}
    }
    
    fireEvent.change(hiddenInput, { target: { files: invalidFiles } })
    expect(screen.queryByText('hello.png')).not.toBeInTheDocument()
  })

  it('removes file', () => {
    renderWithProviders(<Submission />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: [file] } })
    
    const removeBtn = document.querySelector('.submission__remove-btn') as HTMLButtonElement
    fireEvent.click(removeBtn)
    
    expect(screen.queryByText('hello.png')).not.toBeInTheDocument()
  })

  it('navigates to course when back to course is clicked', async () => {
    renderWithProviders(<Submission />)
    
    // Trigger submission success
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: [file] } })
    const submitBtn = screen.getByRole('button', { name: /Aflevér opgave/i })
    fireEvent.click(submitBtn)
    
    // Find text asynchronously, as it renders after 2000ms delay
    const successMsg = await screen.findByText(/Din aflevering er modtaget/i, {}, { timeout: 5000 })
    expect(successMsg).toBeInTheDocument()
    
    // Click 'Back to course'
    const backBtn = screen.getByRole('button', { name: /Tilbage til kursus/i })
    fireEvent.click(backBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/course/1')
  }, 20000)

  it('handles uploading state', () => {
    renderWithProviders(<Submission />)
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: [file] } })
    
    const submitBtn = screen.getByRole('button', { name: /Aflevér opgave/i })
    fireEvent.click(submitBtn)

    expect(submitBtn).toHaveAttribute('aria-disabled', 'true')
    })
  it('handles file upload change with empty list', () => {
    renderWithProviders(<Submission />)
    const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
    fireEvent.change(hiddenInput, { target: { files: [] } })
    expect(screen.queryByText('hello.png')).not.toBeInTheDocument()
  })
  })
