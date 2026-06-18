import { AlertCircle, Clock } from 'lucide-react';

export interface ProcessedDeadline {
  id: number
  titleDa: string
  titleEn: string
  dateKey: string
  courseId: number
  deadlineHoursFromNow: number
  deadlineDate: string
  title: string
  courseTitle: string
  info: {
    label: string
    urgency: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'later'
    color: string
    relativeLabel?: string
    dateLabel?: string
  }
}

export const getUrgencyIcon = (urgency: string) => {
  if (urgency === 'overdue') return AlertCircle
  return Clock
}

export const getLabelClass = (urgency: string) => {
  if (urgency === 'overdue') return 'font-black tracking-tight'
  if (urgency === 'today') return 'font-bold'
  if (urgency === 'tomorrow' || urgency === 'soon') return 'font-semibold'
  return 'font-normal'
}

export const getColorClass = (urgency: string) => {
  if (urgency === 'overdue' || urgency === 'today') return 'text-danger'
  if (urgency === 'tomorrow' || urgency === 'soon') return 'text-warning'
  return 'text-muted'
}
