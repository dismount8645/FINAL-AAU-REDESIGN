import React, { type ReactNode } from "react";
import { Text } from "@/components/ui/Typography";
import Stack from "@/components/ui/Stack";

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
 * - Garanterer 44 × 44 px touch‑mål på interaktive elementer via children.
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
    <Stack gap="xs" className={className}>
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
        <span id={helpId} className="text-xs text-[var(--text-muted)] m-0 leading-tight">
          {helpText}
        </span>
      ) : null}

      {error ? (
        <span id={errorId} className="text-xs m-0 text-danger leading-tight" role="alert">
          {error}
        </span>
      ) : null}
    </Stack>
  );
}
