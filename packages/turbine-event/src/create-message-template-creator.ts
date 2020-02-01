import { MessageTemplateCreator } from './types'

const createMessageTemplateCreator = <Payload>(
  type: string,
): MessageTemplateCreator<Payload> => {
  const fn = (payload: Payload) => {
    return {
      type,
      payload,
    }
  }

  return fn
}

export default createMessageTemplateCreator
