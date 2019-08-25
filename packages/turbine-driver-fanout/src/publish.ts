import { AnyMessage } from '@mishguru/turbine'
import { v2 as fanout } from 'aws-fanout'
import { FANOUT_ENV, AWS_CREDENTIALS } from '@mishguru/turbine-utils-fanservice'

const AWS_FANOUT_LOG_QUEUE = 'logger'

const seen = new Set<string>()

const publish = async (message: AnyMessage) => {
  const { type, id, parentId, sentFrom, sentAt, payload } = message

  const topicName = FANOUT_ENV + '-' + type

  if (seen.has(topicName) === false) {
    seen.add(topicName)
    const logQueueName = FANOUT_ENV + '-' + AWS_FANOUT_LOG_QUEUE
    await fanout.subscribeQueueToTopic(AWS_CREDENTIALS, {
      queueName: logQueueName,
      topicName: topicName,
    })
  }

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
