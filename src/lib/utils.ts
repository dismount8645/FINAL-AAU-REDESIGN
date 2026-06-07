
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React, { type ReactNode } from 'react';
import type { StagedFile } from '@/lib/types';
import { registryTools } from '@/lib/data';
import { translations } from '@/lib/translations';
import type { Lang } from '@/store';
import {
  FileText, Play, Link2, Upload, File, type LucideIcon,
  PenSquare, BookOpen, Wifi, Mail, Users, Cloud, Book, ClipboardList, Video,
} from 'lucide-react';
import type { ResourceTool } from '@/lib/types';

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

// ── Tool registry ────────────────────────────────────────────────────────────
interface RawTool {
  iconName: string;
  [key: string]: unknown;
}

const ICON_MAP: Record<string, LucideIcon> = {
  PenSquare,
  FileText,
  BookOpen,
  Wifi,
  Mail,
  Users,
  Cloud,
  Book,
  ClipboardList,
  Video,
}

const mapTool = (tool: RawTool): ResourceTool => ({
  ...tool,
  icon: ICON_MAP[tool.iconName] || /* istanbul ignore next */ FileText,
}) as unknown as ResourceTool

export const allTools: ResourceTool[] = registryTools
  .filter(t => t.category === 'tools')
  .map(mapTool)

export const allEssentials: ResourceTool[] = registryTools
  .filter(t => t.category === 'essentials')
  .map(mapTool)

export const allToolsList: ResourceTool[] = [...allTools, ...allEssentials]

// ── Storage helpers ──────────────────────────────────────────────────────────
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (!item) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        if (typeof defaultValue === 'string') {
          return item as unknown as T;
        }
        console.warn(`Could not parse storage key "${key}" as JSON, using default.`);
        return defaultValue;
      }
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  }
};

// ── Date helpers ─────────────────────────────────────────────────────────────
function localeForLang(lang: Lang): string {
  return lang === 'da' ? 'da-DK' : 'en-US'
}

export function hoursFromNow(hours: number, from = new Date()): string {
  const date = new Date(from)
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

export function getHoursUntil(date: string | Date, from = new Date()): number {
  return (new Date(date).getTime() - from.getTime()) / (1000 * 60 * 60)
}

export function formatTime(date: Date, lang: Lang): string {
  return date.toLocaleTimeString(localeForLang(lang), { hour: '2-digit', minute: '2-digit' })
}

export function formatLongDateTime(date: Date, lang: Lang): string {
  return date.toLocaleString(localeForLang(lang), { dateStyle: 'long', timeStyle: 'short' })
}

function formatShortDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(localeForLang(lang), { day: 'numeric', month: 'short' })
}

export function formatRelativeDateGroup(date: Date, lang: Lang, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (target.getTime() === today.getTime()) {
    return translations[lang].today as string as string
  }

  if (target.getTime() === yesterday.getTime()) {
    return translations[lang].yesterday as string as string
  }

  return formatShortDate(date, lang)
}

type UrgencyLevel = 'overdue' | 'critical' | 'soon' | 'normal'

export function calculateUrgency(deadlineDate: string): UrgencyLevel {
  const hoursLeft = getHoursUntil(deadlineDate)
  if (hoursLeft < 0) return 'overdue'
  if (hoursLeft < 24) return 'critical'
  if (hoursLeft < 72) return 'soon'
  return 'normal'
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

  describe('tools', () => {
    it('allTools has at least one item', () => {
      expect(allTools.length).toBeGreaterThan(0)
    })
    it('allEssentials has at least one item', () => {
      expect(allEssentials.length).toBeGreaterThan(0)
    })
    it('allToolsList equals combined array', () => {
      expect(allToolsList).toEqual([...allTools, ...allEssentials])
    })
    it('every allTools item has category tools', () => {
      allTools.forEach(t => {
        expect((t as { category?: string }).category).toBe('tools')
      })
    })
    it('every allEssentials item has category essentials', () => {
      allEssentials.forEach(t => {
        expect((t as { category?: string }).category).toBe('essentials')
      })
    })
    it('every item has an icon component', () => {
      allToolsList.forEach(t => {
        expect(t.icon).toBeDefined()
        expect(t.icon.displayName).toBeDefined()
      })
    })
    it('contains Digital Eksamen tool by id 1', () => {
      expect(allToolsList.some(t => t.id === 1)).toBe(true)
    })
  })

  describe('storage', () => {
    it('handles all resilience scenarios', () => {
      localStorage.setItem('test_json_err', 'invalid-json')
      expect(storage.get('test_json_err', { a: 1 })).toEqual({ a: 1 })
      expect(storage.get('test_json_err', 'fallback-string')).toBe('invalid-json')

      const originalGetItem = localStorage.getItem
      localStorage.getItem = () => { throw new Error('getItem error') }
      expect(storage.get('test_key', 'fallback')).toBe('fallback')
      localStorage.getItem = originalGetItem

      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => { throw new Error('setItem error') }
      storage.set('test_key', 'val')
      localStorage.setItem = originalSetItem

      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = () => { throw new Error('removeItem error') }
      storage.remove('test_key')
      localStorage.removeItem = originalRemoveItem

      const originalWindow = globalThis.window
      delete (globalThis as any).window
      try {
        expect(storage.get('test_key', 'fallback')).toBe('fallback')
        storage.set('test_key', 'val')
        storage.remove('test_key')
      } finally {
        (globalThis as any).window = originalWindow
      }
    })

    it('get returns parsed JSON when key exists', () => {
      localStorage.setItem('happyKey', JSON.stringify({ foo: 'bar' }))
      expect(storage.get('happyKey', {})).toEqual({ foo: 'bar' })
    })

    it('set stores JSON string via localStorage.setItem', () => {
      const setSpy = vi.spyOn(window.localStorage, 'setItem')
      storage.set('happyKey', { foo: 'bar' })
      expect(setSpy).toHaveBeenCalledWith('happyKey', JSON.stringify({ foo: 'bar' }))
      setSpy.mockRestore()
    })

    it('remove calls localStorage.removeItem', () => {
      const removeSpy = vi.spyOn(window.localStorage, 'removeItem')
      storage.remove('removeKey')
      expect(removeSpy).toHaveBeenCalledWith('removeKey')
      removeSpy.mockRestore()
    })

    it('get returns plain string when value is not valid JSON', () => {
      localStorage.setItem('plainKey', 'plain-string')
      expect(storage.get('plainKey', 'default')).toBe('plain-string')
    })

    it('get returns default when key does not exist', () => {
      expect(storage.get('noSuchKey', null)).toBeNull()
    })
  })

  describe('dates', () => {
    it('formats time in en and da', () => {
      const d = new Date('2026-05-28T12:00:00')
      expect(formatTime(d, 'en')).toBeDefined()
      expect(formatTime(d, 'da')).toBeDefined()
    })

    it('formats long date time', () => {
      const d = new Date('2026-05-28T12:00:00')
      expect(formatLongDateTime(d, 'en')).toBeDefined()
      expect(formatLongDateTime(d, 'da')).toBeDefined()
    })

    it('calculates urgency correctly', () => {
      const now = new Date()
      const overdue = new Date(now.getTime() - 3600000).toISOString()
      const critical = new Date(now.getTime() + 3600000).toISOString()
      const soon = new Date(now.getTime() + 100000000).toISOString()
      const normal = new Date(now.getTime() + 500000000).toISOString()

      expect(calculateUrgency(overdue)).toBe('overdue')
      expect(calculateUrgency(critical)).toBe('critical')
      expect(calculateUrgency(soon)).toBe('soon')
      expect(calculateUrgency(normal)).toBe('normal')
    })

    it('formats relative date group', () => {
      const now = new Date('2026-05-28T12:00:00')
      const today = new Date('2026-05-28T10:00:00')
      const yesterday = new Date('2026-05-27T10:00:00')
      const other = new Date('2026-05-20T10:00:00')

      expect(formatRelativeDateGroup(today, 'en', now)).toBe('Today')
      expect(formatRelativeDateGroup(yesterday, 'en', now)).toBe('Yesterday')
      expect(formatRelativeDateGroup(other, 'en', now)).toContain('May')
    })

    it('gets hours until and hours from now', () => {
      const now = new Date()
      const target = hoursFromNow(5, now)
      expect(getHoursUntil(target, now)).toBeCloseTo(5, 5)
    })
  })
}
