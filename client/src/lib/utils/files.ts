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
