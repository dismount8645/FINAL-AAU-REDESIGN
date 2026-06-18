import React, { forwardRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Text } from './Typography';
import { cn } from '@/lib/utils';

import { Input, type InputProps } from '@/components/ui/Input';

// ==========================================
// SearchInput component definitions
// ==========================================

export interface SearchInputProps extends Omit<InputProps, "type" | "onChange"> {
  onChange?: (val: string) => void
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
    const finalIconSize = iconSize ?? 14
    const input = (
      <div className={cn("relative flex-1", className)}>
        <Search size={finalIconSize} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={finalPlaceholder}
          className="pl-10 h-9 min-h-0"
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
            <X size={14} strokeWidth={2} />
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
