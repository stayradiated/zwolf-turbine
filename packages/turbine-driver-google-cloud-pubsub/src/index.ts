import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { AnyMessage, SubscribeOptions } from '@stayradiated/turbine'

import createTopic from './create-topic'
import subscribeViaHTTP from './subscribe-via-http'
import subscribeViaPolling from './subscribe-via-polling'

interface CreateDriverOptions {
  pushEndpoint?: string,
  serviceAccount?: string,
  config?: ClientConfig,
}

const createDriver = (options: CreateDriverOptions = {}) => {
  const { config, pushEndpoint, serviceAccount } = options

  return {
    publish: async (message: AnyMessage) => {
      const { type: topicName } = message
      const dataBuffer = Buffer.from(JSON.stringify(message), 'utf8')
      const topic = await createTopic(config, topicName)
      await topic.publish(dataBuffer)
    },
    subscribe: async (options: SubscribeOptions) => {
      if (pushEndpoint) {
        console.info(
          `Subscribing to Google Cloud PubSub via HTTP [${pushEndpoint}]...`,
        )
        return subscribeViaHTTP(config, options, pushEndpoint, serviceAccount)
      } else {
        console.info('Subscribing to Google Cloud PubSub via polling...')
        return subscribeViaPolling(config, options)
      }
    },
  }
}

export default createDriver
