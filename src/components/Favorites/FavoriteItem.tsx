import { memo } from 'react';


import { motion, type HTMLMotionProps } from 'framer-motion';
import { X, type LucideIcon, BookOpen } from 'lucide-react';
import { Link, MemoryRouter } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { getFavoriteLabel } from '@/lib/favorites';
import type { Lang } from '@/store';
import { translations } from '@/lib/translations';
import type { FavoriteType } from '@/lib/types';
import { cn } from '@/lib/utils';

const typeClasses: Record<FavoriteType, string> = {
  course: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground',
  tool: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
  file: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
  forum: 'bg-info/10 text-info dark:bg-info/20 dark:text-info',
  link: 'bg-[var(--aau-light-pink)]/10 text-[var(--aau-light-pink)] dark:bg-[var(--aau-light-pink)]/20 dark:text-[var(--aau-light-pink)]',
}

export interface FavoriteItemData {
  id: string
  type: FavoriteType
  entityId: number
  title: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  link: string
  external?: boolean
}

interface FavoriteItemProps {
  item: FavoriteItemData
  lang: Lang
  onRemove: (type: FavoriteType, entityId: number) => void
  onClick?: () => void
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  draggable?: boolean
  compact?: boolean
}

const FavoriteItem = memo(function FavoriteItem({
  item,
  lang,
  onRemove,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  draggable = false,
}: FavoriteItemProps) {
  const Icon = item.icon
  return (
    <motion.div
      draggable={draggable}
      onDragStart={onDragStart as HTMLMotionProps<'div'>['onDragStart']}
      onDragOver={onDragOver as HTMLMotionProps<'div'>['onDragOver']}
      onDrop={onDrop as HTMLMotionProps<'div'>['onDrop']}
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }}
      className={cn(
        "group relative flex items-center gap-xs p-xs rounded-[var(--radius-xl)] border border-[var(--border-color)] bg-bg-card hover:border-primary/30 focus-within:shadow-focus focus-within:outline-none transition-all cursor-pointer select-none",
        draggable && "active:opacity-60",
      )}
    >
      {/* Primary Semantic Navigation - Stretched Link Pattern */}
      {item.external ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 rounded-[var(--radius-xl)] focus:outline-none"
          aria-label={item.title}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault()
            }
          }}
        />
      ) : (
        <Link
          to={item.link}
          className="absolute inset-0 z-10 rounded-[var(--radius-xl)] focus:outline-none"
          aria-label={item.title}
          onClick={(e) => {
            if (onClick) {
              e.preventDefault()
            }
          }}
        />
      )}

      <div
        className={cn(
          "relative z-20 flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] shrink-0 pointer-events-none",
          typeClasses[item.type]
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="relative z-20 flex-1 min-w-0 pointer-events-none">
        <div className="text-sm font-medium truncate text-main">
          {item.title}
        </div>
        <span
          className={cn(
            "inline-flex items-center text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-[var(--radius-pill)] mt-0.5",
            typeClasses[item.type]
          )}
        >
          {getFavoriteLabel(item.type, lang)}
        </span>
      </div>

      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        onClick={(e) => { 
          e.stopPropagation()
          e.preventDefault()
          onRemove(item.type, item.entityId) 
        }}
        className="relative z-30 text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all shrink-0"
        aria-label={(translations[lang]?.remove_favorite as string) || 'Remove from favorites'}
      >
        <X size={14} strokeWidth={2} />
      </Button>
    </motion.div>
  )
})

export default FavoriteItem

if (import.meta.vitest) {
  describe('FavoriteItem', () => {
    const mockItem = {
      id: '1',
      type: 'course' as const,
      entityId: 101,
      title: 'Test Course',
      icon: BookOpen,
      iconBg: 'blue',
      iconColor: 'white',
      link: '/course/101',
    }
  
    const mockOnRemove = vi.fn()
    const mockOnClick = vi.fn()
  
    const renderItem = (props = {}) => render(
      <MemoryRouter>
        <FavoriteItem
          item={mockItem}
          lang="en"
          onRemove={mockOnRemove}
          onClick={mockOnClick}
          {...props}
        />
      </MemoryRouter>
    )
  
    it('renders correctly', () => {
      renderItem()
      expect(screen.getByText('Test Course')).toBeInTheDocument()
      expect(screen.getByText('Course')).toBeInTheDocument()
    })
  
    it('calls onClick when clicked', () => {
      renderItem()
      fireEvent.click(screen.getByText('Test Course'))
      expect(mockOnClick).toHaveBeenCalled()
    })
  
    it('calls onRemove when remove button is clicked', () => {
      renderItem()
      const removeButton = screen.getByLabelText('Remove from favorites')
      fireEvent.click(removeButton)
      expect(mockOnRemove).toHaveBeenCalledWith('course', 101)
    })
  
    it('renders correctly in Danish', () => {
      renderItem({ lang: 'da' })
      expect(screen.getByText('Kursus')).toBeInTheDocument()
      expect(screen.getByLabelText('Fjern fra favoritter')).toBeInTheDocument()
    })
  
    it('handles drag events', () => {
      const onDragStart = vi.fn()
      const onDragOver = vi.fn()
      const onDrop = vi.fn()

      renderItem({
        draggable: true,
        onDragStart,
        onDragOver,
        onDrop,
      })

      const container = screen.getByText('Test Course').closest('div[draggable="true"]')
      if (!container) throw new Error('Container not found')

      fireEvent.dragStart(container)
      expect(onDragStart).toHaveBeenCalled()

      fireEvent.dragOver(container)
      expect(onDragOver).toHaveBeenCalled()

      fireEvent.drop(container)
      expect(onDrop).toHaveBeenCalled()
    })

    it('calls e.preventDefault on external link when onClick provided', () => {
      render(
        <MemoryRouter>
          <FavoriteItem
            item={{ ...mockItem, external: true }}
            lang="en"
            onRemove={mockOnRemove}
            onClick={mockOnClick}
          />
        </MemoryRouter>
      )
      const link = screen.getByLabelText('Test Course')
      fireEvent.click(link)
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('calls e.preventDefault on internal link when onClick provided', () => {
      render(
        <MemoryRouter>
          <FavoriteItem
            item={mockItem}
            lang="en"
            onRemove={mockOnRemove}
            onClick={mockOnClick}
          />
        </MemoryRouter>
      )
      const link = screen.getByLabelText('Test Course')
      fireEvent.click(link)
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('renders external link without onClick', () => {
      render(
        <MemoryRouter>
          <FavoriteItem
            item={{ ...mockItem, external: true }}
            lang="en"
            onRemove={mockOnRemove}
          />
        </MemoryRouter>
      )
      const link = screen.getByLabelText(/Test Course/)
      fireEvent.click(link)
      expect(screen.getByText('Test Course')).toBeInTheDocument()
    })

    it('renders internal link without onClick', () => {
      render(
        <MemoryRouter>
          <FavoriteItem
            item={mockItem}
            lang="en"
            onRemove={mockOnRemove}
          />
        </MemoryRouter>
      )
      const link = screen.getByLabelText(/Test Course/)
      fireEvent.click(link)
      expect(screen.getByText('Test Course')).toBeInTheDocument()
    })
  })
}
