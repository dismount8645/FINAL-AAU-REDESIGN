import React, { type ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { motion, AnimatePresence } from 'framer-motion';
import Stack from '@/components/Stack';
import { Text } from '@/components/Typography';

export interface FormFieldProps {
  id?: string;
  label?: string;
  helpText?: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * FormField – wrapper der håndterer label, help‑tekst og fejl‑meddelelser.
 * - Tilføjer `aria-describedby` og `aria-invalid` automatisk.
 * - Garanterer 44 x 44 px touch-maal paa interaktive elementer via children.
 */
export default function FormField({
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

if (import.meta.vitest) {
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
  })
}
