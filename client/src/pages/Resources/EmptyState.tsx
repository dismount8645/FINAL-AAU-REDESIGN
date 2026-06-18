import { Text, Button } from '@/components/ui';
import { env } from '@/lib/env';

interface EmptyStateProps {
  showEmptyState: boolean;
  searchQuery: string;
  lang: string;
  onClearSearch: () => void;
}

function EmptyState({ showEmptyState, searchQuery, lang, onClearSearch }: EmptyStateProps) {
  if (!showEmptyState) return null

  return (
    <div className="py-xl text-center flex flex-col items-center gap-md">
      <div>
        <Text weight="bold" size="lg">
          {lang === 'da' ? 'Ingen systemer fundet' : 'No systems found'}
          {searchQuery && (
            <span className="text-text-muted">
              {lang === 'da' ? ` for "${searchQuery}"` : ` for "${searchQuery}"`}
            </span>
          )}
        </Text>
        <Text muted className="mt-xs">
          {lang === 'da'
            ? 'Prøv at søge efter fx "eksamen", "mail", "software" eller "STADS".'
            : 'Try searching for "exam", "mail", "software" or "STADS".'}
        </Text>
      </div>
      <div className="flex items-center gap-sm">
        <Button
          variant="primary"
          size="sm"
          onClick={onClearSearch}
          className="normal-case tracking-normal font-bold"
        >
          {lang === 'da' ? 'Ryd søgning' : 'Clear search'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="text-primary normal-case tracking-normal font-bold"
        >
          {lang === 'da' ? 'Kontakt IT-support' : 'Contact IT support'}
        </Button>
      </div>
    </div>
  )
}

export default EmptyState
