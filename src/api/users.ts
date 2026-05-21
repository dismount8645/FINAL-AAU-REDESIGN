import { api } from '@/api/index'
import { messagesData } from '@/data/mockData'
import type { MessageThread } from '@/types'

export const usersApi = {
  getMessages() {
    return api.get<MessageThread[]>('/users/messages', () => messagesData)
  },
}
