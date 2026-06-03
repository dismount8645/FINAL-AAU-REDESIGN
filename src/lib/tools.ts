import { LucideIcon, PenSquare, FileText, BookOpen, Wifi, Mail, Users, Cloud, Book, ClipboardList, Video } from 'lucide-react'
import mockData from '@/lib/mockData.json'
import type { ResourceTool } from '@/types'

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

export const allTools: ResourceTool[] = mockData.allTools.map(tool => ({
  ...tool,
  icon: ICON_MAP[tool.iconName] || FileText,
})) as ResourceTool[]

export const allEssentials: ResourceTool[] = mockData.allEssentials.map(essential => ({
  ...essential,
  icon: ICON_MAP[essential.iconName] || FileText,
})) as ResourceTool[]

export const allToolsList: ResourceTool[] = [...allTools, ...allEssentials]