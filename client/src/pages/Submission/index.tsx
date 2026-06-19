import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, Text, Heading } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import PageLayout from '@/components/Layout/PageLayout';
import { PATHS } from '@/routes';
import SplitLayout from '@/components/Layout/SplitLayout';
import Textarea from '@/components/ui/Textarea';
import { submitAssignment } from '@/lib/api';
import { storage } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';
import useStore from '@/store';
import { useToast } from '@/components/ui/Toast';
import { processFileMetadata } from '@/lib/utils';
import type { StagedFile } from '@/lib/types';
import SubmissionDropzone from './SubmissionDropzone';
import SubmissionFileList from './SubmissionFileList';
import SubmissionSuccess from './SubmissionSuccess';
import SubmissionDetails from './SubmissionDetails';

function Submission() {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>()
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const toast = useToast()
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
    setFiles((prev) => prev.filter((f) => f.id !== id))
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
      toast.error(t('common.error_message') || 'Something went wrong')
    }
  }

  if (status === 'submitted') {
    return (
      <SubmissionSuccess
        onBackToCourse={() => navigate(PATHS.COURSE(courseId || ''))}
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
