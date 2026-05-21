import { useState, useRef } from 'react'
import Icon from '@/components/ui/Icon'
import { Heading, Text } from '@/components/ui/Typography'
import Stack from '@/components/ui/Stack'

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
      className={`dropzone flex flex-col items-center justify-center border-2 border-dashed transition-all rounded-[var(--radius-xl)] p-xl cursor-pointer ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-bg-card/50'} focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
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
