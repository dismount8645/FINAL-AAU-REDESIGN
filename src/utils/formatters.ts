/**
 * Centralized formatting utilities for dates, numbers, and other localized strings.
 */

import { Lang } from '@/store/useStore';

export const formatDate = (date: Date | string | number, lang: Lang, options: Intl.DateTimeFormatOptions = {}): string => {
  const d = new Date(date);
  const locale = lang === 'da' ? 'da-DK' : 'en-GB';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
};

export const formatFullDate = (date: Date | string | number, lang: Lang): string => {
  return formatDate(date, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatTime = (date: Date | string | number, lang: Lang): string => {
  const d = new Date(date);
  const locale = lang === 'da' ? 'da-DK' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
};
