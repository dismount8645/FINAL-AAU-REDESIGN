export interface NotificationItem {
  id: number
  type: string
  text: string
  date: Date
  isRead: boolean
  archived: boolean
  course: string
  content: string
  link: string
}
