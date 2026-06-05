import { LucideIcon, PenSquare, FileText, BookOpen, Wifi, Mail, Users, Cloud, Book, ClipboardList, Video } from 'lucide-react'
import { registryTools } from '@/lib/data'
import type { ResourceTool } from '@/lib/types'

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

const mapTool = (tool: any): ResourceTool => ({
  ...tool,
  icon: ICON_MAP[tool.iconName] || FileText,
}) as ResourceTool

export const allTools: ResourceTool[] = registryTools
  .filter(t => t.category === 'tools')
  .map(mapTool)

export const allEssentials: ResourceTool[] = registryTools
  .filter(t => t.category === 'essentials')
  .map(mapTool)

export const allToolsList: ResourceTool[] = [...allTools, ...allEssentials]