import mem from 'mem'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { debuglog } from '@stayradiated/turbine'

import createTopic from './create-topic'

interface CreatePushSubscriptionOptions {
  config: ClientConfig,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
  serviceAccount: string,
}

const createPushSubscription = mem(
  async (options: CreatePushSubscriptionOptions) => {
    const {
      config,
      topicName,
      subscriptionName,
      pushEndpoint,
      serviceAccount,
    } = options

    const topic = await createTopic(config, topicName)
    const subscription = topic.subscription(subscriptionName)
    const [subscriptionExists] = await subscription.exists()

    if (!subscriptionExists) {
      debuglog(`Creating push subscription: ${subscriptionName}`)
      await topic.createSubscription(subscriptionName, {
        pushEndpoint,
        oidcToken: {
          serviceAccountEmail: serviceAccount,
        },
      } as any)
    } else {
      await subscription.modifyPushConfig({
        pushEndpoint,
        oidcToken: {
          serviceAccountEmail: serviceAccount,
        },
      } as any)
    }
    return subscription
  },
  {
    cacheKey: JSON.stringify,
  },
)

export default createPushSubscription
