import { useState, useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Icon from '@/components/Icon';
import Stack from '@/components/Stack';
import { Heading, Text } from '@/components/Typography';

interface SubmissionDropzoneProps {
  onFilesAdded: (files: FileList) => void
  t: (key: string) => string
}

export default function SubmissionDropzone({ onFilesAdded, t }: SubmissionDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <Stack
      align="center"
      justify="center"
      className={`dropzone flex flex-col items-center justify-center border-2 border-dashed transition-all rounded-[var(--radius-xl)] p-xl cursor-pointer ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-bg-card/50'} focus-visible:outline-none focus-visible:shadow-focus`}
      gap="sm"
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files) {
          onFilesAdded(e.dataTransfer.files)
        }
      }}
    >
      <Icon name="cloud-arrow-up" className="submission__dropzone-icon text-[48px] text-[var(--color-primary)]" />
      <Heading level={3}>{t('click_or_drag')}</Heading>
      <Text size="sm" muted>PDF, JPG, PNG{t('submission_or_zip')} (Max 50MB)</Text>
      <input
        ref={fileInputRef}
        id="fileInput"
        type="file"
        multiple
        className="submission__hidden-input hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFilesAdded(e.target.files)
          }
        }}
      />
    </Stack>
  )
}


if (import.meta.vitest) {
  const mockOnFilesAdded = vi.fn()
  const mockT = vi.fn((key: string) => {
    const map: Record<string, string> = {
      click_or_drag: 'Klik eller træk filer',
      submission_or_zip: ' eller ZIP',
    }
    return map[key] || key
  })
  
  function renderDropzone() {
    return render(<SubmissionDropzone onFilesAdded={mockOnFilesAdded} t={mockT} />)
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders dropzone with translated text', () => {
    renderDropzone()
    expect(screen.getByText('Klik eller træk filer')).toBeInTheDocument()
    expect(screen.getByText(/PDF, JPG, PNG/)).toBeInTheDocument()
  })
  
  it('calls file input click when dropzone is clicked', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    renderDropzone()
    const zone = screen.getByRole('button')
    await userEvent.click(zone)
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })
  
  it('calls file input click when Enter is pressed', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    renderDropzone()
    const zone = screen.getByRole('button')
    zone.focus()
    await userEvent.keyboard('{Enter}')
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })
  
  it('calls file input click when Space is pressed', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    renderDropzone()
    const zone = screen.getByRole('button')
    zone.focus()
    await userEvent.keyboard(' ')
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })
  
  it('sets drag state on dragOver and clears on dragLeave', () => {
    renderDropzone()
    const zone = screen.getByRole('button')
  
    fireEvent.dragOver(zone)
    expect(zone.className).toContain('border-primary')
  
    fireEvent.dragLeave(zone)
    expect(zone.className).toContain('border-border')
  })
  
  it('calls onFilesAdded with files on drop', () => {
    renderDropzone()
    const zone = screen.getByRole('button')
    const files = [new File(['test'], 'test.pdf', { type: 'application/pdf' })]
    const dataTransfer = { files }
  
    fireEvent.drop(zone, { dataTransfer })
    expect(mockOnFilesAdded).toHaveBeenCalledWith(files)
  })
  
  it('calls onFilesAdded when file input changes', () => {
    renderDropzone()
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' })
    const input = document.getElementById('fileInput') as HTMLInputElement
  
    fireEvent.change(input, { target: { files: [file] } })
    expect(mockOnFilesAdded).toHaveBeenCalledWith([file])
  })
  
  it('does not trigger file input click on other key presses', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    renderDropzone()
    const zone = screen.getByRole('button')
    fireEvent.keyDown(zone, { key: 'Tab' })
    expect(clickSpy).not.toHaveBeenCalled()
    clickSpy.mockRestore()
  })
  
  it('does not call onFilesAdded when file input change has no files', () => {
    renderDropzone()
    const input = document.getElementById('fileInput') as HTMLInputElement
  
    fireEvent.change(input, { target: { files: null } })
    expect(mockOnFilesAdded).not.toHaveBeenCalled()
  })
  
  it('does not call onFilesAdded on drop when dataTransfer.files is empty', () => {
    renderDropzone()
    const zone = screen.getByRole('button')
  
    fireEvent.drop(zone, { dataTransfer: { files: null } })
    expect(mockOnFilesAdded).not.toHaveBeenCalled()
  })
}
