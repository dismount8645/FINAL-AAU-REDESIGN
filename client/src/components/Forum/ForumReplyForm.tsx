import Button from '@/components/ui/Button'
import { Reply } from 'lucide-react'
import useStore from '@/store'

interface ForumReplyFormProps {
  onReplyClick?: () => void
}

export default function ForumReplyForm({ onReplyClick }: ForumReplyFormProps) {
  const t = useStore(state => state.t)

  return (
    <div className="mt-xl">
      <Button variant="primary" icon={Reply} onClick={onReplyClick}>
        {t('write_reply')}
      </Button>
    </div>
  )
}
