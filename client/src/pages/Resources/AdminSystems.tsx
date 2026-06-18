import ResourcesSection from '@/components/Resources/ResourcesSection';
import type { ResourceTool } from '@/lib/types';

interface AdminSystemsProps {
  filteredTools: ResourceTool[];
  activeCategory: string;
  lang: string;
  t: (key: string) => string;
  onToggleFavorite: (id: number) => void;
}

function AdminSystems({ filteredTools, activeCategory, lang, t, onToggleFavorite }: AdminSystemsProps) {
  if (!((activeCategory === 'all' || activeCategory === 'tools') && filteredTools.length > 0)) {
    return null
  }

  return (
    <ResourcesSection
      title={lang === 'da' ? 'Studieadministrative' : 'Administrative'}
      subtitle={t('administrative_systems_desc')}
      tools={filteredTools}
      onToggleFavorite={(id) => onToggleFavorite(id)}
    />
  )
}

export default AdminSystems
