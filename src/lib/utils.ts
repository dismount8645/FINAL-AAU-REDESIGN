
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React, { type ReactNode } from 'react';
import type { StagedFile } from '@/lib/types';
import { FileText, Play, Link2, Upload, File, type LucideIcon } from 'lucide-react';

const FILE_TYPE_MAP: Record<string, { icon: LucideIcon; colorClass: string }> = {
  pdf: { icon: FileText, colorClass: 'text-danger bg-danger/10' },
  video: { icon: Play, colorClass: 'text-success bg-success/10' },
  link: { icon: Link2, colorClass: 'text-info bg-info/10' },
  assignment: { icon: Upload, colorClass: 'text-accent bg-accent/10' },
  file: { icon: File, colorClass: 'text-muted bg-bg-highlight/50' },
};

export function getFileTypeConfig(typeOrName: string | undefined | null) {
  const name = (typeOrName || '').toLowerCase();
  if (name === 'pdf' || name.endsWith('.pdf')) {
    return FILE_TYPE_MAP.pdf;
  }
  if (name === 'video' || name.match(/\.(mp4|mkv|avi|mov|mp3|wav)$/)) {
    return FILE_TYPE_MAP.video;
  }
  if (name === 'link' || name.startsWith('http')) {
    return FILE_TYPE_MAP.link;
  }
  if (name === 'assignment') {
    return FILE_TYPE_MAP.assignment;
  }
  return FILE_TYPE_MAP.file;
}

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
  describe('processFileMetadata', () => {
    function createMockFile(name: string, size = 1024): File {
      return { name, size, type: '', lastModified: Date.now(), slice: () => new Blob() } as File
    }

    it('transforms a FileList into StagedFile array', () => {
      const file = createMockFile('document.pdf', 5 * 1024 * 1024)
      const fileList = { 0: file, length: 1 } as unknown as FileList
      const result = processFileMetadata(fileList)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('document.pdf')
      expect(result[0].size).toBe((5).toFixed(2) + ' MB')
      expect(result[0].id).toBeDefined()
    })

    it('handles filenames without extension', () => {
      const file = createMockFile('README')
      const fileList = { 0: file, length: 1 } as unknown as FileList
      const result = processFileMetadata(fileList)
      expect(result[0].name).toBe('README')
    })

    it('handles multiple files', () => {
      const f1 = createMockFile('a.txt')
      const f2 = createMockFile('b.txt')
      const fileList = { 0: f1, 1: f2, length: 2 } as unknown as FileList
      const result = processFileMetadata(fileList)
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('a.txt')
      expect(result[1].name).toBe('b.txt')
    })
  })

  /* eslint-disable @typescript-eslint/no-explicit-any */
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

  describe('getFileTypeConfig', () => {
    it('returns pdf config', () => {
      const config = getFileTypeConfig('document.pdf')
      expect(config.colorClass).toBe('text-danger bg-danger/10')
    })

    it('returns video config', () => {
      const config = getFileTypeConfig('movie.mp4')
      expect(config.colorClass).toBe('text-success bg-success/10')
    })

    it('returns link config', () => {
      const config = getFileTypeConfig('http://example.com')
      expect(config.colorClass).toBe('text-info bg-info/10')
    })

    it('returns assignment config', () => {
      const config = getFileTypeConfig('assignment')
      expect(config.colorClass).toBe('text-accent bg-accent/10')
    })

    it('returns default file config', () => {
      const config = getFileTypeConfig('unknown.xyz')
      expect(config.colorClass).toBe('text-muted bg-bg-highlight/50')
    })
  })
}
