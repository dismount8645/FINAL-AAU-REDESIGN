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

if (import.meta.vitest) {
  describe('tools', () => {
    it('allTools has at least one item', () => {
      expect(allTools.length).toBeGreaterThan(0)
    })
    it('allEssentials has at least one item', () => {
      expect(allEssentials.length).toBeGreaterThan(0)
    })
    it('allToolsList equals combined array', () => {
      expect(allToolsList).toEqual([...allTools, ...allEssentials])
    })
    it('every allTools item has category tools', () => {
      allTools.forEach(t => {
        expect((t as { category?: string }).category).toBe('tools')
      })
    })
    it('every allEssentials item has category essentials', () => {
      allEssentials.forEach(t => {
        expect((t as { category?: string }).category).toBe('essentials')
      })
    })
    it('every item has an icon component', () => {
      allToolsList.forEach(t => {
        expect(t.icon).toBeDefined()
        expect(t.icon.displayName).toBeDefined()
      })
    })
    it('contains Digital Eksamen tool by id 1', () => {
      expect(allToolsList.some(t => t.id === 1)).toBe(true)
    })
  })
}
