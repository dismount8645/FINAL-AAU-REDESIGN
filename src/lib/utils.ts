import { describe, it, expect } from 'vitest';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React, { type ReactNode } from 'react';
import type { StagedFile } from '@/lib/types';

export function processFileMetadata(fileList: FileList): StagedFile[] {
  return Array.from(fileList).map((file) => ({
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    id: crypto.randomUUID(),
  }))
}

export function linkifyText(text: string): ReactNode {
  const urlPattern = /(https?:\/\/[^\s]+|[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (urlPattern.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`
      return React.createElement(
        'a',
        {
          key: i,
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-primary hover:underline'
        },
        part
      )
    }
    return part
  })
}


/**
 * `cn` er en wrapper omkring `clsx` + `tailwind-merge`.
 * Den fjerner duplikerede Tailwind‑klasser og håndterer betinget
 * klassesammensætning på tværs af komponenter.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

if (import.meta.vitest) {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })
  
    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    })
  
    it('handles tailwind class conflicts', () => {
      expect(cn('px-4', 'px-2')).toBe('px-2')
    })
  
    it('handles empty input', () => {
      expect(cn()).toBe('')
    })
  
    it('handles undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })
  })
}
