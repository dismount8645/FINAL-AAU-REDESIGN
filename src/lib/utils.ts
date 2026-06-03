import { describe, it, expect } from 'vitest';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
