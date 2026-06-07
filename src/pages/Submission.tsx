import { useState, useRef } from 'react';


import { ArrowLeft, Trash2, Check, Book } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { StagedFile } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Card, Heading, Text, Icon, IconCircle } from '@/components/ui';
import { MasterItem } from '@/components/ui';
import PageLayout from '@/components/Layout/PageLayout';
import SplitLayout from '@/components/Layout/SplitLayout';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import Textarea from '@/components/ui/Textarea';
import { submitAssignment } from '@/lib/api';
import { storage } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';
import useStore from '@/store';

import { getFileTypeConfig, processFileMetadata } from '@/lib/utils';

function SubmissionDropzone({ onFilesAdded, t }: { onFilesAdded: (files: FileList) => void; t: (key: string) => string }) {
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

function SubmissionFileList({ files, onRemoveFile, t }: { files: StagedFile[]; onRemoveFile: (id: string) => void; t: (key: string) => string }) {
  if (files.length === 0) return null

  return (
    <Stack gap="md" className="submission__files mt-[var(--space-xl)]">
      <Heading level={4}>{t('selected_files')}</Heading>
      <Stack gap="sm">
        {files.map((file) => {
          const fileConfig = getFileTypeConfig(file.name)
          const FileIcon = fileConfig.icon
          return (
            <MasterItem
              key={file.id}
              className="border border-border/40 rounded-[var(--radius-md)]"
              leading={
                <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-sm)] shrink-0 transition-colors ${fileConfig.colorClass}`}>
                  <FileIcon size={18} strokeWidth={2.5} aria-hidden="true" />
                </div>
              }
              title={
                <Text weight="semibold" className="text-sm">{file.name}</Text>
              }
              subtitle={file.size}
              trailing={
                <Button
                  variant="ghost"
                  size="xs"
                  icon={Trash2}
                  onClick={() => onRemoveFile(file.id)}
                  aria-label={t('submission_remove_file')}
                  className="submission__remove-btn text-[var(--color-danger)]"
                />
              }
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

function SubmissionSuccess({ onBackToCourse, t }: { onBackToCourse: () => void; t: (key: string) => string }) {
  return (
    <Stack align="center" justify="center" className="container submission__success-wrapper min-h-[60vh]">
      <Card className="submission__success-card max-w-xl w-full text-center">
        <Card.Body className="submission__success-body p-[var(--space-3xl)_var(--space-xl)]">
          <Stack align="center" gap="xl">
            <IconCircle icon={Check} size={64} bg="var(--color-success)" color="white" />
            <Stack gap="xs">
              <Heading level={1}>{t('submission_success')}</Heading>
              <Text muted>
                {t('submission_received')}
              </Text>
            </Stack>
            <Stack direction="row" gap="md" align="center" fullWidth>
              <Button variant="primary" full onClick={onBackToCourse}>
                {t('back_to_course')}
              </Button>
              <Button variant="secondary" full>{t('view_receipt')}</Button>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    </Stack>
  )
}

function SubmissionDetails({ t }: { t: (key: string) => string }) {
  return (
    <Stack gap="lg">
      <Card>
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('pre_submission_checklist')}</Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="xs" className="submission__checklist list-none p-[var(--space-0)]">
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_id')}
              </Text>
            </li>
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_pdf')}
              </Text>
            </li>
            <li className="flex items-center gap-[var(--space-xs)]">
              <Text size="sm">
                <Icon name="square-check" variant="success" size="sm" /> {t('submission_checklist_sources')}
              </Text>
            </li>
          </Stack>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Text weight="bold" size="lg" className="card__title">{t('submission_help')}</Text>
        </Card.Header>
        <Card.Body>
          <Text size="xs" muted className="submission__help-text mb-[var(--space-md)] block">
            {t('submission_help_desc')}
          </Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="ghost" size="sm" icon={Book} full>
            {t('view_submission_guide')}
          </Button>
        </Card.Footer>
      </Card>
    </Stack>
  )
}

function Submission() {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>()
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const [files, setFiles] = useState<StagedFile[]>([])
  const [status, setStatus] = useState<string>('draft')
  const [comment, setComment] = useState<string>('')

  const assignmentInfo = {
    title: assignmentId === '105' ? 'Designskitse' : 'Projekt: Byg en To-Do App',
    course: courseId === '1' ? 'Digital Design og Kommunikation' : 'Webudvikling og CMS',
    deadline: assignmentId === '105'
      ? t('deadline_friday')
      : t('deadline_monday'),
    description: t('event_detail_desc'),
  }



  const removeFile = (id: string): void => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const handleSubmit = async () => {
    if (files.length === 0) return
    setStatus('uploading')
    try {
      await submitAssignment({
        courseId,
        assignmentId,
        files: files.map(f => f.name),
        comment,
      })
      setStatus('submitted')
      if (courseId && assignmentId) {
        const completed = storage.get<number[]>(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}${courseId}`, [])
        const parsedId = parseInt(assignmentId, 10)
        if (!isNaN(parsedId) && !completed.includes(parsedId)) {
          storage.set(`${STORAGE_KEYS.COURSE_PROGRESS_PREFIX}${courseId}`, [...completed, parsedId])
        }
      }
    } catch {
      setStatus('draft')
    }
  }

  if (status === 'submitted') {
    return (
      <SubmissionSuccess
        onBackToCourse={() => navigate(`/course/${courseId}`)}
        t={t}
      />
    )
  }

  return (
    <PageLayout
      className="container"
      title={assignmentInfo.title}
      subtitle={assignmentInfo.course}
      headerChildren={
        <Stack gap="sm">
          <Link to={`/course/${courseId}`}>
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              {t('back_to_course')}
            </Button>
          </Link>
          <Stack direction="row" gap="lg">
            <Stack direction="row" gap="xs">
              <Text size="sm" muted>{t('deadline')}:</Text>
              <Text size="sm" weight="bold" className="submission__deadline text-[var(--aau-light-orange)]">{assignmentInfo.deadline}</Text>
            </Stack>
            <Stack direction="row" gap="xs">
              <Text size="sm" muted>{t('status_label')}</Text>
              <Text size="sm" weight="bold">{t('not_submitted')}</Text>
            </Stack>
          </Stack>
        </Stack>
      }
    >
      <SplitLayout
        main={
          <Stack gap="lg">
            <Card className="submission__card">
              <Card.Header>
                  <Text weight="bold" size="lg" className="card__title">{t('instructions')}</Text>
              </Card.Header>
              <Card.Body>
                <Text size="sm" muted className="submission__description leading-[1.6]">{assignmentInfo.description}</Text>
              </Card.Body>
            </Card>

            <Stack gap="md" className="submission-zone">
              <SubmissionDropzone onFilesAdded={(fileList) => setFiles((prev) => [...prev, ...processFileMetadata(fileList)])} t={t} />
              <SubmissionFileList files={files} onRemoveFile={removeFile} t={t} />
            </Stack>

            <Stack gap="md" className="submission__comment-section">
              <Heading level={4}>{t('comment_to_instructor')}</Heading>
              <Textarea
                placeholder={t('write_comment')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                className="submission__comment-input min-h-[120px]"
              />
            </Stack>

            <Stack direction="row" gap="lg" align="center" className="submission__actions">
              <Button
                variant={files.length > 0 ? 'primary' : 'secondary'}
                onClick={handleSubmit}
                disabled={files.length === 0 || status === 'uploading'}
                className="submission__submit-btn min-w-[var(--space-3xl)] w-full justify-center"
                loading={status === 'uploading'}
                aria-label={t('submit_assignment')}
              >
                {status === 'uploading' ? '' : t('submit_assignment')}
              </Button>
              <Text size="xs" muted className="submission__disclaimer max-w-[300px]">
                {t('submission_disclaimer')}
              </Text>
            </Stack>
          </Stack>
        }
        sidebar={<SubmissionDetails t={t} />}
        mainSpan={8}
        sidebarSpan={4}
      />
    </PageLayout>
  )
}

export default Submission

let mockNavigate: ReturnType<typeof vi.fn>
const mockSubmitAssignment = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }))
if (import.meta.vitest) {
  mockNavigate = vi.fn()
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      useParams: () => ({ courseId: '1', assignmentId: '105' })
    }
  })
  vi.mock('@/lib/api', () => ({ submitAssignment: mockSubmitAssignment }))

  describe('SubmissionDropzone', () => {
    const mockOnFilesAdded = vi.fn()
    const mockT = vi.fn((key: string) => {
      const map: Record<string, string> = {
        click_or_drag: 'Klik eller træk filer',
        submission_or_zip: ' eller ZIP',
      }
      return map[key] || key
    })

    const renderDropzone = () => {
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
      const userEvent = await import('@testing-library/user-event')
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
      renderDropzone()
      const zone = screen.getByRole('button')
      await userEvent.default.click(zone)
      expect(clickSpy).toHaveBeenCalled()
      clickSpy.mockRestore()
    })

    it('calls file input click when Enter is pressed', async () => {
      const userEvent = await import('@testing-library/user-event')
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
      renderDropzone()
      const zone = screen.getByRole('button')
      zone.focus()
      await userEvent.default.keyboard('{Enter}')
      expect(clickSpy).toHaveBeenCalled()
      clickSpy.mockRestore()
    })

    it('calls file input click when Space is pressed', async () => {
      const userEvent = await import('@testing-library/user-event')
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
      renderDropzone()
      const zone = screen.getByRole('button')
      zone.focus()
      await userEvent.default.keyboard(' ')
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

    it('handles submitAssignment failure and returns to draft', async () => {
      mockSubmitAssignment.mockRejectedValueOnce(new Error('fail'))
      renderWithProviders(<Submission />)
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      const hiddenInput = document.querySelector('#fileInput') as HTMLInputElement
      fireEvent.change(hiddenInput, { target: { files: [file] } })
      fireEvent.click(screen.getByRole('button', { name: /Aflevér opgave/i }))
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: /Aflevér opgave/i })).not.toBeDisabled()
      })
    })

    it('types in the comment textarea', () => {
      renderWithProviders(<Submission />)
      const textarea = screen.getByPlaceholderText('Skriv en kommentar...')
      fireEvent.change(textarea, { target: { value: 'Test comment' } })
      expect(textarea).toHaveValue('Test comment')
    })
    })
}
