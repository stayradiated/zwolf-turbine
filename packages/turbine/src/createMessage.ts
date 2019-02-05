import { v4 as uuid } from 'uuid'

const createMessage = (options: {
  type: string
  payload: any
  sentFrom?: string
  parentId?: string
}) => ({
  id: uuid(),
  sentAt: Date.now(),
  ...options,
})

export default createMessage
