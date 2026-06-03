import { forwardRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search, X, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import type { InputProps } from '@/components/Input';
import { cn } from '@/lib/utils';

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
            aria-label="Submit search"
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

if (import.meta.vitest) {
  describe('SearchInput', () => {
    it('renders search input with default placeholder', () => {
      render(<SearchInput />)
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })
  
    it('renders search input with custom placeholder', () => {
      render(<SearchInput placeholder="Custom placeholder" />)
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
    })
  
    it('calls onChange when text is entered', () => {
      const handleChange = vi.fn()
      render(<SearchInput value="" onChange={handleChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test query' } })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  
    it('shows clear button when value is present and onClear is provided', () => {
      const handleClear = vi.fn()
      render(<SearchInput value="test" onChange={() => {}} onClear={handleClear} />)
      const clearButton = screen.getByLabelText('Clear search')
      expect(clearButton).toBeInTheDocument()
      fireEvent.click(clearButton)
      expect(handleClear).toHaveBeenCalledTimes(1)
    })
  
    it('does not show clear button when value is empty', () => {
      render(<SearchInput value="" onChange={() => {}} onClear={() => {}} />)
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
    })
  
    it('shows submit button when onSubmit is provided and value is not clearable', () => {
      const handleSubmit = vi.fn()
      render(<SearchInput value="test" onChange={() => {}} onSubmit={handleSubmit} />)
      const submitBtn = screen.getByRole('button')
      expect(submitBtn).toBeInTheDocument()
      expect(submitBtn.getAttribute('type')).toBe('submit')
    })
  
    it('calls onSubmit on form submit', () => {
      const handleSubmit = vi.fn()
      render(<SearchInput value="test" onChange={() => {}} onSubmit={handleSubmit} />)
      const input = screen.getByRole('textbox')
      fireEvent.submit(input)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })
}
