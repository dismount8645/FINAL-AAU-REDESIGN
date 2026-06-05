import { Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Heading, Text } from '@/components/ui'
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { MasterItem } from '@/components/ui'
import { StagedFile } from '@/lib/types'
import { getFileTypeConfig } from '@/lib/utils'

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
