import { useState } from 'react';


import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { StagedFile } from '@/lib/types';
import SubmissionSuccess from '@/components/Submission/SubmissionSuccess';
import SubmissionDropzone from '@/components/Submission/SubmissionDropzone';
import SubmissionFileList from '@/components/Submission/SubmissionFileList';;
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui';
import PageHeader from '@/components/Layout/PageHeader';
import SplitLayout from '@/components/Layout/SplitLayout';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import SubmissionDetails from '@/components/Layout/SubmissionDetails';;
import Textarea from '@/components/ui/Textarea';
import { Heading, Text } from '@/components/ui';
import { submitAssignment } from '@/lib/api';
import { storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import useStore from '@/store';

import { processFileMetadata } from '@/lib/utils';

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
    <Stack className="container">
      <PageHeader
        title={assignmentInfo.title}
        subtitle={assignmentInfo.course}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: assignmentInfo.course, href: `/course/${courseId}` },
          { label: assignmentInfo.title },
        ]}
      >
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
      </PageHeader>

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
    </Stack>
  )
}

export default Submission

let mockNavigate: ReturnType<typeof vi.fn>
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
}
