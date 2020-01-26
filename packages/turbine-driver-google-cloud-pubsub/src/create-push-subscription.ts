import mem from 'mem'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { debuglog } from '@stayradiated/turbine'
import { Subscription } from '@google-cloud/pubsub'

import createTopic from './create-topic'

/**
 * Force @google-cloud/pubsub to support oidcToken.
 * Currently waiting for this PR to be merged:
 * https://github.com/googleapis/nodejs-pubsub/pull/865
 */

const formatMetadata = Subscription.formatMetadata_
Subscription.formatMetadata_ = function (metadata: any) {
  const formatted = formatMetadata.call(this, metadata)

  if (metadata.oidcToken) {
    formatted.pushConfig = {
      ...formatted.pushConfig,
      oidcToken: metadata.oidcToken,
    }
    delete formatted.oidcToken
  }

  return formatted
}

interface CreatePushSubscriptionOptions {
  config: ClientConfig,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
  serviceAccountEmail: string,
}

const createPushSubscription = mem(
  async (options: CreatePushSubscriptionOptions) => {
    const {
      config,
      topicName,
      subscriptionName,
      pushEndpoint,
      serviceAccountEmail,
    } = options

    const topic = await createTopic(config, topicName)
    const subscription = topic.subscription(subscriptionName)
    const [subscriptionExists] = await subscription.exists()

    if (subscriptionExists) {
      debuglog(`Modifying push subscription: ${subscriptionName}`)
      await subscription.modifyPushConfig({
        pushEndpoint,
        oidcToken: {
          serviceAccountEmail,
        },
      } as any)
    } else {
      debuglog(`Creating push subscription: ${subscriptionName}`)
      await topic.createSubscription(subscriptionName, {
        pushEndpoint,
        oidcToken: {
          serviceAccountEmail,
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
