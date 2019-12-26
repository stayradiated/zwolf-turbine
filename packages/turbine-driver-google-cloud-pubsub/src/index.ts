import mem from 'mem'
import { PubSub } from '@google-cloud/pubsub'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { AnyMessage, SubscribeOptions } from '@stayradiated/turbine'

import subscribeViaHTTP from './subscribe-via-http'

interface CreateDriverOptions {
  subscribeViaHTTP?: boolean,
  config?: ClientConfig,
}

const createPubSub = mem((config: ClientConfig) => {
  return new PubSub(config)
})

const createTopic = mem(
  async (config: ClientConfig, topicName: string) => {
    const pubsub = createPubSub(config)
    const topic = pubsub.topic(topicName)
    const [topicExists] = await topic.exists()
    if (!topicExists) {
      await pubsub.createTopic(topicName)
    }
    return topic
  },
  {
    cacheKey: JSON.stringify,
  },
)

const createSubscription = mem(
  async (config: ClientConfig, topicName: string, subscriptionName: string) => {
    const topic = await createTopic(config, topicName)
    const subscription = topic.subscription(subscriptionName)
    const [subscriptionExists] = await subscription.exists()
    if (!subscriptionExists) {
      await topic.createSubscription(subscriptionName)
    }
    return subscription
  },
  {
    cacheKey: JSON.stringify,
  },
)

const createDriver = (options?: CreateDriverOptions) => {
  const { config, subscribeViaHTTP: shouldSubscribeViaHTTP } = options

  return {
    publish: async (message: AnyMessage) => {
      const { type: topicName, payload } = message
      const dataBuffer = Buffer.from(JSON.stringify(payload), 'utf8')
      const topic = await createTopic(config, topicName)
      await topic.publish(dataBuffer)
    },
    subscribe: async (options: SubscribeOptions) => {
      const { serviceName, events } = options

      if (shouldSubscribeViaHTTP) {
        return subscribeViaHTTP()
      }

      await Promise.all(
        events.map(async (event) => {
          const [topicName, handle] = event

          const subscriptionName = `${serviceName}-${topicName}`
          const subscription = await createSubscription(
            config,
            topicName,
            subscriptionName,
          )

          subscription.on('message', async (message) => {
            const { data } = message
            const payload = JSON.parse(data.toString('utf8'))
            await handle(payload)
            message.ack()
          })
        }),
      )
    },
  }
}

export default createDriver
