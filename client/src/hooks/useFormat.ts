import { useCallback } from 'react';
import useStore from '@/store';
import {
  formatTime as rawFormatTime,
  formatLongDateTime as rawFormatLongDateTime,
  formatRelativeDateGroup as rawFormatRelativeDateGroup,
  getDeadlineInfo
} from '@/lib/utils';
import type { CourseItem } from '@/lib/types';

export function useFormat() {
  const lang = useStore((state) => state.lang);

  const formatTime = useCallback((date: Date | string) => {
    return rawFormatTime(new Date(date), lang);
  }, [lang]);

  const formatLongDateTime = useCallback((date: Date | string) => {
    return rawFormatLongDateTime(new Date(date), lang);
  }, [lang]);

  const formatRelativeDateGroup = useCallback((date: Date | string) => {
    return rawFormatRelativeDateGroup(new Date(date), lang);
  }, [lang]);

  const formatDeadline = useCallback((dateStr: string | Date) => {
    if (!dateStr) return '';
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    const info = getDeadlineInfo(parsedDate, lang);
    return info.relativeLabel || '';
  }, [lang]);

  const getCourseItemMetadata = useCallback((item: CourseItem) => {
    const typeLabel = (() => {
      switch (item.type) {
        case 'pdf': return 'PDF';
        case 'video': return 'Video';
        case 'link': return lang === 'da' ? 'Ekstern ressource' : 'External resource';
        case 'assignment': return lang === 'da' ? 'Aflevering' : 'Assignment';
        default: return '';
      }
    })();

    if (item.type === 'pdf' && item.size) {
      return `PDF · ${item.size}`;
    }
    if (item.type === 'video' && item.duration) {
      return `Video · ${item.duration}`;
    }
    if (item.type === 'assignment' && item.deadline) {
      const formattedDead = formatDeadline(item.deadline);
      const prefix = lang === 'da' ? 'Aflevering' : 'Assignment';
      return formattedDead ? `${prefix} · ${formattedDead}` : prefix;
    }
    return typeLabel;
  }, [lang, formatDeadline]);

  return {
    lang,
    formatTime,
    formatLongDateTime,
    formatRelativeDateGroup,
    formatDeadline,
    getCourseItemMetadata,
  };
}



