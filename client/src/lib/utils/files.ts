import { FileText, Play, Link2, Upload, File, type LucideIcon } from 'lucide-react';
import type { StagedFile } from '@/lib/types';

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

if (import.meta.vitest) {
  function createMockFile(name: string, size = 1024): File {
    return { name, size, type: '', lastModified: Date.now(), slice: () => new Blob() } as File
  }

  describe('processFileMetadata', () => {
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
