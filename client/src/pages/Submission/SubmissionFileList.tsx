import { Trash2 } from 'lucide-react';
import type { StagedFile } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Heading, Text, MasterItem } from '@/components/ui';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { getFileTypeConfig } from '@/lib/utils';

interface SubmissionFileListProps {
  files: StagedFile[];
  onRemoveFile: (id: string) => void;
  t: (key: string) => string;
}

function SubmissionFileList({ files, onRemoveFile, t }: SubmissionFileListProps) {
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
              leading={FileIcon}
              leadingClassName={fileConfig.colorClass}
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

export default SubmissionFileList
