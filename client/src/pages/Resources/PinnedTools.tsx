import { Star, ExternalLink } from 'lucide-react';
import { Text } from '@/components/ui';
import ResourcesSection from '@/components/Resources/ResourcesSection';
import { env } from '@/lib/env';
import type { ResourceTool } from '@/lib/types';

interface PinnedToolsProps {
  pinnedTools: ResourceTool[];
  searchQuery: string;
  activeCategory: string;
  lang: string;
  onToggleFavorite: (id: number) => void;
}

function PinnedTools({ pinnedTools, searchQuery, activeCategory, lang, onToggleFavorite }: PinnedToolsProps) {
  if (pinnedTools.length === 0 || searchQuery || activeCategory !== 'all') {
    return null
  }

  if (pinnedTools.length <= 3) {
    return (
      <div className="bg-primary/5 dark:bg-primary/10 p-md rounded-2xl border border-primary/10">
        <Text weight="bold" size="md" className="mb-sm">
          {lang === 'da' ? 'Dine fastgjorte værktøjer' : 'Your pinned tools'}
        </Text>
        <div className="flex flex-wrap gap-sm">
          {pinnedTools.map(tool => {
            const shortTitle = lang === 'da'
              ? (tool.shortTitleDa ?? tool.titleDa)
              : (tool.shortTitleEn ?? tool.titleEn)
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => env.open(tool.url)}
                aria-label={lang === 'da' ? `Åbn ${shortTitle}` : `Open ${shortTitle}`}
                className="flex items-center gap-sm bg-bg-card border border-border/60 hover:bg-bg-hover hover:border-primary/40 rounded-full px-lg py-2 text-sm font-bold transition-all cursor-pointer shadow-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Star size={14} strokeWidth={2} fill="currentColor" className="text-warning shrink-0" />
                <span>{shortTitle}</span>
                <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary/5 dark:bg-primary/10 p-md rounded-2xl border border-primary/10">
      <ResourcesSection
        title={lang === 'da' ? 'Dine fastgjorte værktøjer' : 'Your pinned tools'}
        subtitle={lang === 'da' ? 'Hurtig genvej til dine foretrukne systemer' : 'Quick shortcut to your favorite tools'}
        tools={pinnedTools}
        isStarredOnly
        showSsoWarning={false}
        onToggleFavorite={(id) => onToggleFavorite(id)}
      />
    </div>
  )
}

export default PinnedTools
