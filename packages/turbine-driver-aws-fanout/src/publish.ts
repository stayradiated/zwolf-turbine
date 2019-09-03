import { AnyMessage } from '@mishguru/turbine'
import { v2 as fanout } from 'aws-fanout'
import { AWS_CREDENTIALS } from '@mishguru/turbine-utils-fanservice'

import { AWS_FANOUT_LOG_QUEUE } from './constants'
import withFanoutEnvPrefix from './with-fanout-env-prefix'

const publish = async (message: AnyMessage) => {
  const { type, id, parentId, sentFrom, sentAt, payload } = message

  const topicName = withFanoutEnvPrefix(type)
  const logQueueName = withFanoutEnvPrefix(AWS_FANOUT_LOG_QUEUE)

  await fanout.subscribeQueueToTopic(AWS_CREDENTIALS, {
    queueName: logQueueName,
    topicName: topicName,
  })

  await fanout.publishMessage(AWS_CREDENTIALS, {
    topicName,
    message: JSON.stringify({
      ...payload,
      __turbine__: {
        type,
        id,
        parentId,
        sentFrom,
        sentAt,
      },
    }),
  })
}

export default publish
