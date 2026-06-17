import {
  FileText, type LucideIcon,
  PenSquare, BookOpen, Wifi, Mail, Users, Cloud, Book, ClipboardList, Video,
} from 'lucide-react';
import { registryTools } from '@/lib/data';
import type { ResourceTool } from '@/lib/types';

interface RawTool {
  iconName: string;
  [key: string]: unknown;
}

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

const mapTool = (tool: RawTool): ResourceTool => ({
  ...tool,
  icon: ICON_MAP[tool.iconName] || /* istanbul ignore next */ FileText,
}) as unknown as ResourceTool

export const allTools: ResourceTool[] = registryTools
  .filter(t => t.category === 'tools')
  .map(mapTool)

export const allEssentials: ResourceTool[] = registryTools
  .filter(t => t.category === 'essentials')
  .map(mapTool)

export const allToolsList: ResourceTool[] = [...allTools, ...allEssentials]
