import React, { type ReactNode } from 'react';

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

/* eslint-disable @typescript-eslint/no-explicit-any */
if (import.meta.vitest) {
  describe('linkifyText', () => {
    it('replaces https URL with anchor element', () => {
      const result = linkifyText('Visit https://example.com now') as any[]
      expect(result).toHaveLength(3)
      expect(result[0]).toBe('Visit ')
      expect(result[1].type).toBe('a')
      expect(result[1].props.href).toBe('https://example.com')
      expect(result[2]).toBe(' now')
    })

    it('returns text unchanged when no URLs present', () => {
      const result = linkifyText('Just plain text') as any[]
      expect(result).toHaveLength(1)
      expect(result[0]).toBe('Just plain text')
    })

    it('handles multiple URLs in text', () => {
      const result = linkifyText('https://a.com and https://b.com') as any[]
      expect(result[0]).toBe('')
      expect(result[1].type).toBe('a')
      expect(result[2]).toBe(' and ')
      expect(result[3].type).toBe('a')
    })
  })
}
