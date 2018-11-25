import { decodeNameFromTopicArn, } from '@mishguru/fanout-helpers'

import { FANOUT_ENV } from './constants'

const parseRawMessage = (message: Message) => {
  const type =
    message && message.TopicArn
      ? decodeNameFromTopicArn(FANOUT_ENV, message.TopicArn)
      : ''

  const payload = message && message.Message
    ? JSON.parse(message.Message)
    : {}

  return {
    type,
    payload
  }
}

export default parseRawMessage
