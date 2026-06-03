import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { StagedFile } from '@/components/submissionTypes';
import SubmissionSuccess from '@/components/SubmissionSuccess';
import SubmissionDropzone from '@/components/SubmissionDropzone';
import SubmissionFileList from '@/components/SubmissionFileList';
import SubmissionDetails from '@/components/SubmissionDetails';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import PageHeader from '@/components/PageHeader';
import Stack from '@/components/Stack';
import Textarea from '@/components/Textarea';
import { Heading, Text } from '@/components/Typography';
import { submitAssignment } from '@/lib/api';
import { storage } from '@/lib/storage';
import useStore from '@/lib/store';
import { renderWithProviders } from '@/lib/test-utils';

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

  const processFiles = (fileList: FileList | null): void => {
    if (!fileList) return
    const newFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      id: crypto.randomUUID(),
    }))
    setFiles((prev) => [...prev, ...newFiles])
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
        const completed = storage.get<number[]>(`courseProgress_${courseId}`, [])
        const parsedId = parseInt(assignmentId, 10)
        if (!isNaN(parsedId) && !completed.includes(parsedId)) {
          storage.set(`courseProgress_${courseId}`, [...completed, parsedId])
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

      <Grid>
        <Grid.Item span={8}>
          <Card className="submission__card mb-[var(--space-xl)]">
            <Card.Header>
                <Text weight="bold" size="lg" className="card__title">{t('instructions')}</Text>
            </Card.Header>
            <Card.Body>
              <Text size="sm" muted className="submission__description leading-[1.6]">{assignmentInfo.description}</Text>
            </Card.Body>
          </Card>

          <section className="submission-zone">
            <SubmissionDropzone onFilesAdded={processFiles} t={t} />
            <SubmissionFileList files={files} onRemoveFile={removeFile} t={t} />
          </section>

          <Stack gap="md" className="submission__comment-section mt-[var(--space-2xl)]">
            <Heading level={4}>{t('comment_to_instructor')}</Heading>
            <Textarea
              placeholder={t('write_comment')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              className="submission__comment-input min-h-[120px]"
            />
          </Stack>

          <Stack direction="row" gap="lg" align="center" className="submission__actions mt-[var(--space-2xl)]">
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
        </Grid.Item>

        <Grid.Item span={4}>
          <SubmissionDetails t={t} />
        </Grid.Item>
      </Grid>
    </Stack>
  )
}

export default Submission

let mockNavigate
if (import.meta.vitest) {
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
}
