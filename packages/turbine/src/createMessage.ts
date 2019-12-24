import { ulid } from 'ulid'

import { AnyMessage } from './types'

interface Options {
  type: string,
  payload: any,
  id?: string,
  sentAt?: number,
  sentFrom?: string,
  parentId?: string,
}

const createMessage = (options: Options): AnyMessage => {
  const message = {
    ...options,
    id: options.id == null ? ulid() : options.id,
    sentAt: options.sentAt == null ? Date.now() : options.sentAt,
  }
  return message
}

export default createMessage
