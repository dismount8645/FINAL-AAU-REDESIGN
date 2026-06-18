import SearchResultItem from './SearchResultItem';

interface SearchCategoryGroupProps {
  label: string;
  items: any[];
  type: string;
  flattenedResults: any[];
  activeSearchIndex: number;
  onItemSelect: (item: any) => void;
  onHover: (index: number) => void;
}

function SearchCategoryGroup({ label, items, type, flattenedResults, activeSearchIndex, onItemSelect, onHover }: SearchCategoryGroupProps) {
  return (
    <div className="category-group border-b border-border/30 pb-2xs">
      <div className="category-header p-xs px-md bg-bg-highlight/40 text-xs font-bold text-text-muted uppercase tracking-wider">
        {label}
      </div>
      {items.map((item) => {
        const index = flattenedResults.findIndex((x: any) => x.type === type && x.raw.id === item.id);
        return (
          <SearchResultItem
            key={item.id}
            type={type}
            id={item.id}
            index={index}
            activeSearchIndex={activeSearchIndex}
            title={item.title || item.titleDa || item.titleEn || item.name}
            subtitle={item.code || item.time}
            onClick={() => onItemSelect(flattenedResults[index])}
            onHover={() => onHover(index)}
          />
        )
      })}
    </div>
  )
}

export default SearchCategoryGroup
