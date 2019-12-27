import mem from 'mem'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'

import createTopic from './create-topic'

interface CreatePushSubscriptionOptions {
  config: ClientConfig,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
}

const createPushSubscription = mem(
  async (options: CreatePushSubscriptionOptions) => {
    const { config, topicName, subscriptionName, pushEndpoint } = options

    const topic = await createTopic(config, topicName)
    const subscription = topic.subscription(subscriptionName)
    const [subscriptionExists] = await subscription.exists()
    if (!subscriptionExists) {
      await topic.createSubscription(subscriptionName, {
        pushEndpoint,
      })
    } else {
      await subscription.modifyPushConfig({
        pushEndpoint,
      })
    }
    return subscription
  },
  {
    cacheKey: JSON.stringify,
  },
)

export default createPushSubscription
