import mem from 'mem'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { debuglog } from '@stayradiated/turbine'
import { Subscription } from '@google-cloud/pubsub'

import { OidcToken } from './types'

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

interface CreateSubscriptionOptions {
  clientConfig: ClientConfig,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
  oidcToken: OidcToken,
  ackDeadlineSeconds: number,
}

const createSubscription = mem(
  async (options: CreateSubscriptionOptions) => {
    const {
      clientConfig,
      topicName,
      subscriptionName,
      pushEndpoint,
      oidcToken,
      ackDeadlineSeconds,
    } = options

    const topic = await createTopic(clientConfig, topicName)
    const subscription = topic.subscription(subscriptionName)
    const [subscriptionExists] = await subscription.exists()

    if (subscriptionExists) {
      const [metadata] = await subscription.getMetadata()
      const { pushConfig } = metadata

      if (
        pushConfig?.pushEndpoint !== pushEndpoint ||
        pushConfig?.oidcToken?.serviceAccountEmail ===
          oidcToken?.serviceAccountEmail ||
        pushConfig?.oidcToken?.audience === oidcToken?.audience
      ) {
        debuglog(`Modifying subscription: ${subscriptionName}`)
        await subscription.modifyPushConfig({
          pushEndpoint,
          oidcToken,
        } as any)
      }
    } else {
      debuglog(`Creating subscription: ${subscriptionName}`)
      await topic.createSubscription(subscriptionName, {
        pushEndpoint,
        oidcToken,
        ackDeadlineSeconds,
        /** todo(george): remove any after nodejs-pubsub supports oidcToken **/
      } as any)
    }
    return subscription
  },
  {
    cacheKey: JSON.stringify,
  },
)

export default createSubscription
