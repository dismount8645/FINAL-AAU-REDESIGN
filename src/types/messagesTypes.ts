export interface ChatMessage {
  id: number
  type: 'in' | 'out'
  text: string
  timestamp?: string
}

export interface Contact {
  id: number
  name: string
  role: string
  msg: string
  time: string
  unread: boolean
  archived: boolean
  messages: ChatMessage[]
}
