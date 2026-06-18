import { ITEM_TYPE_MAP } from '@/lib/theme';
import type { StagedFile } from '@/lib/types';

const fileTypeConfig = (key: keyof typeof ITEM_TYPE_MAP) => {
  const entry = ITEM_TYPE_MAP[key];
  return { icon: entry.icon, colorClass: `text-${entry.color} ${entry.bg}` };
};

export function getFileTypeConfig(typeOrName: string | undefined | null) {
  const name = (typeOrName || '').toLowerCase();
  if (name === 'pdf' || name.endsWith('.pdf')) {
    return fileTypeConfig('pdf');
  }
  if (name === 'video' || name.match(/\.(mp4|mkv|avi|mov|mp3|wav)$/)) {
    return fileTypeConfig('video');
  }
  if (name === 'link' || name.startsWith('http')) {
    return fileTypeConfig('link');
  }
  if (name === 'assignment') {
    return fileTypeConfig('assignment');
  }
  return fileTypeConfig('file');
}

export function processFileMetadata(fileList: FileList): StagedFile[] {
  return Array.from(fileList).map((file) => ({
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    id: crypto.randomUUID(),
  }))
}
