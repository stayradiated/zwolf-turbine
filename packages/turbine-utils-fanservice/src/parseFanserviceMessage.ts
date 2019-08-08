import { decodeNameFromTopicArn } from '@mishguru/fanout-helpers'

import { FANOUT_ENV } from './constants'
import { FanserviceMessage } from './types'

const parseFanserviceMessage = (message: FanserviceMessage) => {
  const type =
    message && message.TopicArn
      ? decodeNameFromTopicArn(FANOUT_ENV, message.TopicArn)
      : 'EB_CRON_JOB'

  const payload =
    message != null && message.Message != null
      ? JSON.parse(message.Message)
      : {}

  const timestamp =
    message != null ? new Date(message.Timestamp).getTime() : undefined

  const turbine = payload.__turbine__ != null ? payload.__turbine__ : {}
  delete payload.__turbine__

  const id = turbine.id != null ? turbine.id : undefined
  const parentId = turbine.parentId != null ? turbine.parentId : undefined
  const sentFrom = turbine.sentFrom != null ? turbine.sentFrom : undefined
  const sentAt = turbine.sentAt != null ? turbine.sentAt : timestamp

  return {
    id,
    parentId,
    sentFrom,
    sentAt,
    type,
    payload,
  }
}

export default parseFanserviceMessage
