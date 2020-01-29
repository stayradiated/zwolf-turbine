import { SubscribeOptions } from '@stayradiated/turbine'

import { CreateDriverOptions, SubscriptionDeliveryType } from './types'

import createSubscription from './create-subscription'
import subscribeViaHTTP from './subscribe-via-http'
import subscribeViaPolling from './subscribe-via-polling'

const subscribe = async (
  createDriverOptions: CreateDriverOptions,
  subscribeOptions: SubscribeOptions,
) => {
  const {
    clientConfig,
    deliveryType,
    pushEndpoint,
    oidcToken,
    ackDeadlineSeconds = 60,
  } = createDriverOptions

  if (deliveryType === SubscriptionDeliveryType.PUSH) {
    // start the HTTP server as soon as possible
    await subscribeViaHTTP(subscribeOptions, {
      requestTimeoutSeconds: ackDeadlineSeconds
    })
  }

  const { serviceName, subscriptionHandlers } = subscribeOptions

  const subscriptions = await Promise.all(
    subscriptionHandlers.map(async (subscriptionHandler) => {
      const topicName = subscriptionHandler.type
      const subscriptionName = `${deliveryType.toLowerCase()}-${serviceName}+${topicName}`

      const subscription = await createSubscription({
        clientConfig,
        topicName,
        subscriptionName,
        pushEndpoint,
        oidcToken,
        ackDeadlineSeconds,
      })

      return subscription
    }),
  )

  if (deliveryType === SubscriptionDeliveryType.PULL) {
    await subscribeViaPolling(subscribeOptions, subscriptions)
  }
}

export default subscribe
