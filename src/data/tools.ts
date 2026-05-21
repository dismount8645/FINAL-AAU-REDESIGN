import { LucideIcon, PenSquare, FileText, BookOpen, Wifi, Mail, Users, Cloud, Book, ClipboardList, Video } from 'lucide-react'
import mockData from '@/data/mockData.json'

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

export const allTools = mockData.allTools.map(tool => ({
  ...tool,
  icon: ICON_MAP[tool.iconName] || FileText,
}))

export const allEssentials = mockData.allEssentials.map(essential => ({
  ...essential,
  icon: ICON_MAP[essential.iconName] || FileText,
}))

export const allToolsList = [...allTools, ...allEssentials]