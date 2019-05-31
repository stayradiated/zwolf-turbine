import { AnyMessage, PublishFn, MessageTemplate } from './types'

import createMessage from './createMessage'

interface Options {
  parent?: AnyMessage,
  serviceName: string,
  publishFn: PublishFn,
}

const createDispatch = (options: Options) => {
  const { parent, serviceName, publishFn } = options
  const parentId = parent != null ? parent.id : null

  return async (messageTemplate: MessageTemplate) => {
    const { type, payload } = messageTemplate
    const message = createMessage({
      type,
      payload,
      parentId,
      sentFrom: serviceName,
    })
    await publishFn(message)
    return message
  }
}

export default createDispatch
