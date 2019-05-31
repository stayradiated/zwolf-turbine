import { ulid } from 'ulid'

interface Options {
  type: string,
  payload: any,
  sentFrom?: string,
  parentId?: string,
}

const createMessage = (options: Options) => {
  return {
    id: ulid(),
    sentAt: Date.now(),
    ...options,
  }
}

export default createMessage
