import { ulid } from 'ulid'

const createMessage = (options: {
  type: string
  payload: any
  sentFrom?: string
  parentId?: string
}) => ({
  id: ulid(),
  sentAt: Date.now(),
  ...options,
})

export default createMessage
