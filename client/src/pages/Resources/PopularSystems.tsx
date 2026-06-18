import { ExternalLink } from 'lucide-react';
import { Text } from '@/components/ui';
import ResourcesSection from '@/components/Resources/ResourcesSection';
import { env } from '@/lib/env';
import type { ResourceTool } from '@/lib/types';

interface PopularSystemsProps {
  popularTools: ResourceTool[];
  filteredPopularTools: ResourceTool[];
  searchQuery: string;
  activeCategory: string;
  lang: string;
  onToggleFavorite: (id: number) => void;
}

function PopularSystems({ popularTools, filteredPopularTools, searchQuery, activeCategory, lang, onToggleFavorite }: PopularSystemsProps) {
  if (!searchQuery && activeCategory === 'all' && popularTools.length > 0) {
    return (
      <div className="flex flex-col gap-sm">
        <Text weight="bold" size="md">
          {lang === 'da' ? 'Populære systemer' : 'Popular systems'}
        </Text>
        <div className="flex flex-wrap gap-sm">
          {popularTools.map(tool => {
            const shortTitle = lang === 'da'
              ? (tool.shortTitleDa ?? tool.titleDa)
              : (tool.shortTitleEn ?? tool.titleEn)
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => env.open(tool.url)}
                className="flex items-center gap-xs bg-bg-card border border-border/80 hover:bg-bg-hover hover:border-primary/40 rounded-full px-md py-2 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{shortTitle}</span>
                <ExternalLink size={14} strokeWidth={2.5} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (activeCategory === 'popular' && filteredPopularTools.length > 0) {
    return (
      <ResourcesSection
        title={lang === 'da' ? 'Populære systemer' : 'Popular systems'}
        subtitle={lang === 'da' ? 'Mest brugte systemer' : 'Most used systems'}
        tools={filteredPopularTools}
        onToggleFavorite={(id) => onToggleFavorite(id)}
      />
    )
  }

  return null
}

export default PopularSystems
