import { decodeNameFromTopicArn } from '@mishguru/fanout-helpers'

import { FANOUT_ENV } from './constants'

type FanserviceMessage = {
  Type: string
  MessageId: string
  TopicArn: string
  Message: string
  Timestamp: string
  SignatureVersion: string
  Signature: string
  SigningCertURL: string
  UnsubscribeURL: string
}

const parseRawMessage = (message: FanserviceMessage) => {
  const type =
    message && message.TopicArn
      ? decodeNameFromTopicArn(FANOUT_ENV, message.TopicArn)
      : 'EB_CRON_JOB'

  const payload = message != null && message.Message != null ? JSON.parse(message.Message) : {}

  const messageId = message != null ? message.MessageId : undefined
  const timestamp = message != null ? new Date(message.Timestamp).getTime() : undefined

  const turbine = payload.__turbine__ != null ? payload.__turbine__ : {}

  const id = turbine.id != null ? turbine.id : messageId
  const sentAt = turbine.sentAt != null ? turbine.sentAt : timestamp

  return {
    id,
    sentAt,
    type,
    payload,
  }
}

export default parseRawMessage
