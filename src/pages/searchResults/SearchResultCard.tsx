import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import TeaserCard from '@/components/ui/TeaserCard'
import { ASSETS } from '@/constants'
import HighlightText from './HighlightText'

export interface SearchResultItem {
  label: string
  path: string
  group: string
  description: string
  img?: string
  code?: string
  professor?: string
}

interface SearchResultCardProps {
  item: SearchResultItem
  query: string
  actionLabel: string
  onClick: () => void
  isStarred?: boolean
  onStarToggle?: () => void
}

export default function SearchResultCard({
  item,
  query,
  actionLabel,
  onClick,
  isStarred,
  onStarToggle,
}: SearchResultCardProps) {
  return (
    <TeaserCard
      variant="horizontal"
      image={item.img || ASSETS.fallback.searchThumbnail}
      badge={item.group}
      title={<HighlightText text={item.label} query={query} />}
      description={item.description}
      isStarred={isStarred}
      onStarToggle={onStarToggle}
      action={
        <Button variant="primary" size="md" iconRight={ArrowRight} pill className="px-md" onClick={(e) => { e.stopPropagation(); onClick() }}>
          {actionLabel}
        </Button>
      }
      onClick={onClick}
    />
  )
}
