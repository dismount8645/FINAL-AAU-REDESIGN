import { Trash2 } from 'lucide-react'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import { Heading, Text } from '@/components/Typography'
import Stack from '@/components/Stack'
import { StagedFile } from './submissionTypes'

interface SubmissionFileListProps {
  files: StagedFile[]
  onRemoveFile: (id: string) => void
  t: (key: string) => string
}

export default function SubmissionFileList({
  files,
  onRemoveFile,
  t,
}: SubmissionFileListProps) {
  if (files.length === 0) return null

  return (
    <Stack gap="md" className="submission__files mt-[var(--space-xl)]">
      <Heading level={4}>{t('selected_files')}</Heading>
      <Stack gap="sm">
        {files.map((file) => (
          <Stack key={file.id} direction="row" align="center" gap="sm" className="file-chip">
            <Icon name="file" />
            <Text weight="semibold">{file.name}</Text>
            <Text muted size="sm">({file.size})</Text>
            <Button
              variant="ghost"
              size="xs"
              icon={Trash2}
              onClick={() => onRemoveFile(file.id)}
              aria-label={t('submission_remove_file')}
              className="submission__remove-btn text-[var(--color-danger)]"
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
