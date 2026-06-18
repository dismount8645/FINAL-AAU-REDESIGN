import { FileText, Play, Upload, Link2, File, type LucideIcon } from 'lucide-react';
import { env } from './env';

export type Theme = 'system' | 'light' | 'dark'
export type Lang = 'da' | 'en'

export function computeIsDarkMode(theme: Theme): boolean {
  /* istanbul ignore next */
  if (typeof window === 'undefined') return false
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return env.matchMedia('(prefers-color-scheme: dark)').matches
}

interface ThemeConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const ITEM_TYPE_MAP: Record<string, ThemeConfig> = {
  pdf: { icon: FileText, color: 'danger', bg: 'bg-danger/10' },
  video: { icon: Play, color: 'success', bg: 'bg-success/10' },
  assignment: { icon: Upload, color: 'accent', bg: 'bg-accent/10' },
  link: { icon: Link2, color: 'info', bg: 'bg-info/10' },
  default: { icon: File, color: 'muted', bg: 'bg-bg-highlight/50' },
  file: { icon: File, color: 'muted', bg: 'bg-bg-highlight/50' },
};

const fileTypeConfig = (key: keyof typeof ITEM_TYPE_MAP) => {
  const entry = ITEM_TYPE_MAP[key];
  return { icon: entry.icon, colorClass: `text-${entry.color} ${entry.bg}` };
};

export function getFileTypeConfig(typeOrName: string | undefined | null) {
  const name = (typeOrName || '').toLowerCase();
  if (name === 'pdf' || name.endsWith('.pdf')) return fileTypeConfig('pdf');
  if (name === 'video' || name.match(/\.(mp4|mkv|avi|mov|mp3|wav)$/)) return fileTypeConfig('video');
  if (name === 'link' || name.startsWith('http')) return fileTypeConfig('link');
  if (name === 'assignment') return fileTypeConfig('assignment');
  return fileTypeConfig('file');
}

export const UI_PALETTE: Record<string, { bg: string; text: string }> = {
  'var(--aau-light-blue)': { bg: 'var(--color-event-blue-bg)', text: 'var(--color-event-blue-text)' },
  'var(--color-accent)': { bg: 'var(--color-event-blue-bg)', text: 'var(--color-event-blue-text)' },
  'var(--color-primary)': { bg: 'var(--color-event-primary-bg)', text: 'var(--color-event-primary-text)' },
  'var(--color-danger)': { bg: 'var(--color-event-danger-bg)', text: 'var(--color-event-danger-text)' },
  'var(--color-danger-dark)': { bg: 'var(--color-event-danger-bg)', text: 'var(--color-event-danger-text)' },
  danger: { bg: 'var(--color-event-danger-bg)', text: 'var(--color-event-danger-text)' },
  accent: { bg: 'var(--color-event-blue-bg)', text: 'var(--color-event-blue-text)' },
  primary: { bg: 'var(--color-event-primary-bg)', text: 'var(--color-event-primary-text)' },
};


