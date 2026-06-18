import ResourcesSection from '@/components/Resources/ResourcesSection';
import type { ResourceTool } from '@/lib/types';

interface EssentialsProps {
  essentialsCommunication: ResourceTool[];
  essentialsFiles: ResourceTool[];
  essentialsTeaching: ResourceTool[];
  activeCategory: string;
  lang: string;
  onToggleFavorite: (id: number) => void;
}

function Essentials({ essentialsCommunication, essentialsFiles, essentialsTeaching, activeCategory, lang, onToggleFavorite }: EssentialsProps) {
  return (
    <>
      {(activeCategory === 'all' || activeCategory === 'comm') && essentialsCommunication.length > 0 && (
        <ResourcesSection
          title={lang === 'da' ? 'Kommunikation' : 'Communication'}
          subtitle={lang === 'da' ? 'Outlook Mail, Microsoft Teams og Zoom' : 'Outlook Mail, Microsoft Teams, and Zoom'}
          tools={essentialsCommunication}
          onToggleFavorite={(id) => onToggleFavorite(id)}
        />
      )}

      {(activeCategory === 'all' || activeCategory === 'files') && essentialsFiles.length > 0 && (
        <ResourcesSection
          title={lang === 'da' ? 'Filer & dokumenter' : 'Files & Documents'}
          subtitle={lang === 'da' ? 'OneDrive lagring, Word & Office, OneNote' : 'OneDrive storage, Word & Office, OneNote'}
          tools={essentialsFiles}
          onToggleFavorite={(id) => onToggleFavorite(id)}
        />
      )}

      {(activeCategory === 'all' || activeCategory === 'eval') && essentialsTeaching.length > 0 && (
        <ResourcesSection
          title={lang === 'da' ? 'Undervisning & evaluering' : 'Teaching & Evaluation'}
          subtitle={lang === 'da' ? 'Forms undersøgelser og Panopto video' : 'Forms surveys and Panopto video'}
          tools={essentialsTeaching}
          onToggleFavorite={(id) => onToggleFavorite(id)}
        />
      )}
    </>
  )
}

export default Essentials
