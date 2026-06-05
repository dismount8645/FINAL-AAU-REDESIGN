import React, { forwardRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Stack } from '@/components/Layout/LayoutPrimitives';;
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import { Input, type InputProps } from '@/components/ui/Input';

// ==========================================
// SearchInput component definitions
// ==========================================

export interface SearchInputProps extends Omit<InputProps, "type"> {
  onClear?: () => void
  onSubmit?: (e: React.FormEvent) => void
  iconSize?: number
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
    const finalPlaceholder = placeholder ?? "Search..."
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

// ==========================================
// FormField component definitions
// ==========================================

export interface FormFieldProps {
  id?: string;
  label?: string;
  helpText?: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  helpText,
  required,
  error,
  children,
  className = "",
}: FormFieldProps) {
  const helpId = id ? `${id}-help` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  return (
    <Stack gap="sm" className={className}>
      {label ? (
        <Text
          tag="label"
          htmlFor={id}
          size="sm"
          weight="bold"
          className="m-0 cursor-pointer block"
        >
          {label}
          {required ? (
            <span className="text-danger ml-2xs" aria-hidden="true">
              *
            </span>
          ) : null}
        </Text>
      ) : null}

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{
            id?: string;
            "aria-invalid"?: boolean | "true" | "false";
            "aria-describedby"?: string;
            required?: boolean;
          }>, {
            id: child.props.id || id,
            "aria-invalid": error ? true : child.props["aria-invalid"],
            "aria-describedby": [
              helpText ? helpId : null,
              error ? errorId : null,
              child.props["aria-describedby"],
            ]
              .filter(Boolean)
              .join(" ") || undefined,
            required: required || child.props.required,
          });
        }
        return child;
      })}

      {helpText ? (
        <span id={helpId} className="text-xs text-muted m-0 leading-tight">
          {helpText}
        </span>
      ) : null}

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            id={errorId}
            className="text-xs m-0 text-danger leading-tight overflow-hidden"
            role="alert"
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Stack>
  );
}

// ==========================================
// Tests
// ==========================================

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

  describe('FormField', () => {
    it('renders without crashing', () => {
      const { container } = render(<FormField label="Test" />)
      expect(container.firstChild).toBeInTheDocument()
    })
  
    it('renders required asterisk', () => {
      render(<FormField label="Name" required />)
      const asterisk = screen.getByText('*')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveClass('text-danger')
    })
  
    it('does not render asterisk when not required', () => {
      render(<FormField label="Name" />)
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })
  
    it('renders helpText', () => {
      render(<FormField label="Name" helpText="This is helpful" />)
      expect(screen.getByText('This is helpful')).toBeInTheDocument()
    })
  
    it('renders error text', () => {
      render(<FormField label="Name" error="Something went wrong" />)
      const errorEl = screen.getByText('Something went wrong')
      expect(errorEl).toBeInTheDocument()
      expect(errorEl).toHaveClass('text-danger')
    })
  
    it('renders without label', () => {
      render(<FormField><span data-testid="child">Content</span></FormField>)
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders non-element children like strings directly', () => {
      render(<FormField label="Text">Simple Text Child</FormField>)
      expect(screen.getByText('Simple Text Child')).toBeInTheDocument()
    })
  })
}
