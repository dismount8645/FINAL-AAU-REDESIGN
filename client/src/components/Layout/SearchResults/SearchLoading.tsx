import { Text } from '@/components/ui';

interface SearchLoadingProps {
  lang: string;
}

function SearchLoading({ lang }: SearchLoadingProps) {
  return (
    <div className="search-dropdown-loading p-md flex items-center justify-center gap-xs">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent shrink-0" />
      <Text size="xs" muted>{lang === 'da' ? 'Søger...' : 'Searching...'}</Text>
    </div>
  )
}

export default SearchLoading
