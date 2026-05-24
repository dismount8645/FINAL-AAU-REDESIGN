import { forwardRef } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Input from "@/components/ui/Input"
import type { InputProps } from "@/components/ui/Input"
import Button from "@/components/ui/Button"

export interface SearchInputProps extends Omit<InputProps, "type"> {
  onClear?: () => void
  onSubmit?: (e: React.FormEvent) => void
  iconSize?: number
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      onSubmit,
      placeholder,
      iconSize,
      className,
      ...props
    },
    ref
  ) => {
    /* istanbul ignore next */
    const finalPlaceholder = placeholder ?? "Search..."
    /* istanbul ignore next */
    const finalIconSize = iconSize ?? 16
    const input = (
      <div className={cn("relative flex-1", className)}>
        <Search size={finalIconSize} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={finalPlaceholder}
          className="pl-10"
          {...props}
        />
        {onClear && value && (
          <Button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-main hover:bg-transparent"
          >
            <X size={16} strokeWidth={2} />
          </Button>
        )}
        {onSubmit && !onClear && (
          <Button
            type="submit"
            variant="primary"
            size="icon-xs"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 transition-all shadow-[var(--shadow-md)]"
          >
            <ArrowRight size={finalIconSize} strokeWidth={2} />
          </Button>
        )}
      </div>
    )

    if (onSubmit) {
      return <form onSubmit={(e) => { e.preventDefault(); onSubmit(e) }} className="w-full">{input}</form>
    }

    return input
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput }
export default SearchInput
