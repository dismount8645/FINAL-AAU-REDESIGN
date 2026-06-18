interface SearchFooterProps {
  searchQuery: string;
  onAddRecentAndNavigate: (query: string) => void;
  t: (key: string) => string;
}

function SearchFooter({ searchQuery, onAddRecentAndNavigate, t }: SearchFooterProps) {
  if (!searchQuery.trim()) return null

  return (
    <button
      type="button"
      className="w-full border-none cursor-pointer focus-visible:outline-none focus-visible:shadow-focus search-dropdown-footer p-sm px-md text-center border-t border-border bg-card hover:bg-bg-hover font-medium block relative before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
      onClick={() => onAddRecentAndNavigate(searchQuery.trim())}
    >
      <span className="text-sm font-medium topbar__all-results">{t('all_results')} &ldquo;{searchQuery}&rdquo;</span>
    </button>
  )
}

export default SearchFooter
