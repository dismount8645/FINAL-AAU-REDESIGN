import { 
  Mail, 
  PenSquare, 
  FileText, 
  Users, 
  Cloud, 
  Wifi,
  type LucideIcon
} from 'lucide-react'

export interface QuickTool {
  id: number
  nameKey: string
  icon: keyof typeof toolIcons
  url: string
}

export const toolIcons = {
  Mail,
  PenSquare,
  FileText,
  Users,
  Cloud,
  Wifi,
} as const

export const quickToolsData: QuickTool[] = [
  { id: 1, nameKey: 'digital_exam', icon: 'PenSquare', url: 'https://digitalservices.aau.dk/dse/exam' },
  { id: 2, nameKey: 'stads', icon: 'FileText', url: 'https://stads.aau.dk' },
  { id: 5, nameKey: 'student_mail', icon: 'Mail', url: 'https://outlook.com/aau.dk' },
  { id: 6, nameKey: 'teams', icon: 'Users', url: 'https://teams.microsoft.com' },
  { id: 7, nameKey: 'onedrive', icon: 'Cloud', url: 'https://aau-my.sharepoint.com' },
  { id: 4, nameKey: 'it_software', icon: 'Wifi', url: 'https://www.its.aau.dk' },
]
