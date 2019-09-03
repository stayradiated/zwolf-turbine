import { SubscribeOptions } from '@mishguru/turbine'
import { v2 as fanout } from 'aws-fanout'
import {
  createRouteMap,
  AWS_CREDENTIALS,
} from '@mishguru/turbine-utils-fanservice'

import withFanoutEnvPrefix from './with-fanout-env-prefix'

import {
  PORT,
  AWS_FANOUT_DEAD_LETTER_QUEUE,
  AWS_FANOUT_MAX_RECEIVE_COUNT,
} from './constants'

import subscribeViaPolling from './subscribe-via-polling'
import subscribeViaHTTP from './subscribe-via-http'

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  if (events.length === 0) {
    return
  }

  const queueName = withFanoutEnvPrefix(serviceName)
  const topicNames = events.map(([topic]) => withFanoutEnvPrefix(topic))
  const deadLetterQueueName = withFanoutEnvPrefix(AWS_FANOUT_DEAD_LETTER_QUEUE)
  const maxReceiveCount = AWS_FANOUT_MAX_RECEIVE_COUNT

  await Promise.all([
    fanout.setQueuePolicy(AWS_CREDENTIALS, {
      queueName,
      topicNames,
      ignoreExistingPolicy: true,
    }),
    fanout.setQueueRedrivePolicy(AWS_CREDENTIALS, {
      queueName,
      deadLetterQueueName,
      maxReceiveCount,
    }),
    ...topicNames.map((topicName) => {
      if (topicName.includes('*') === false) {
        return fanout.subscribeQueueToTopic(AWS_CREDENTIALS, {
          queueName,
          topicName,
        })
      }
    }),
  ])

  const routeMap = createRouteMap(events)

  if (PORT != null) {
    console.info('Subscribing to queue using HTTP server')
    return subscribeViaHTTP({ routeMap, serviceName })
  } else {
    console.info('Subscribing to queue using polling')
    return subscribeViaPolling({ routeMap, serviceName })
  }
}

export default subscribe
