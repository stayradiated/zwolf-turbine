import { SubscribeOptions } from '@zwolf/turbine'

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

  const createSubscriptions = () => {
    const { serviceName, subscriptionHandlers } = subscribeOptions

    return Promise.all(
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
  }

  switch (deliveryType) {
    case SubscriptionDeliveryType.PUSH: {
      await subscribeViaHTTP(createSubscriptions, subscribeOptions, {
        requestTimeoutSeconds: ackDeadlineSeconds,
      })
      break
    }
    case SubscriptionDeliveryType.PULL: {
      await subscribeViaPolling(createSubscriptions, subscribeOptions)
      break
    }
  }
}

export default subscribe
