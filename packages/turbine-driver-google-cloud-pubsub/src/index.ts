import mem from 'mem'
import { PubSub } from '@google-cloud/pubsub'
import { AnyMessage, SubscribeOptions } from '@stayradiated/turbine'

interface DriverConfig {
  projectId: string,
}

const createPubSub = mem((config: DriverConfig) => {
  const { projectId } = config
  return new PubSub({ projectId })
})

const createTopic = mem(
  async (config: DriverConfig, topicName: string) => {
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
  }
)

const createSubscription = mem(
  async (config: DriverConfig, topicName: string, subscriptionName: string) => {
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

const createDriver = (config: DriverConfig) => {
  return {
    publish: async (message: AnyMessage) => {
      const { type: topicName, payload } = message
      const dataBuffer = Buffer.from(JSON.stringify(payload), 'utf8')
      const topic = await createTopic(config, topicName)
      await topic.publish(dataBuffer)
    },
    subscribe: async (options: SubscribeOptions) => {
      const { serviceName, events } = options

      events.forEach(async (event) => {
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
      })
    },
  }
}

export default createDriver