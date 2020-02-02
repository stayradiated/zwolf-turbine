import { AnyMessage, SubscribeOptions } from '@zwolf/turbine'
import { Router } from 'express'
import { Server } from 'http'

import { CreateDriverOptions, SubscriptionDeliveryType } from './types'

import createTopic from './create-topic'
import subscribe from './subscribe'

export interface GoogleCloudPubSubService {
  router: Router,
  server: Server,
}

const validateCreateDriverOptions = (options: CreateDriverOptions): void => {
  const {
    deliveryType,
    pushEndpoint,
    oidcToken = {},
    ackDeadlineSeconds,
  } = options
  const { serviceAccountEmail, audience } = oidcToken

  if (deliveryType === SubscriptionDeliveryType.PUSH && pushEndpoint == null) {
    console.warn(
      'Warning: You have set `deliveryType=PUSH` but have not provided a `pushEndpoint` URL - this is a required property and the Push Subscription will not work without it.',
    )
  }
  if (deliveryType === SubscriptionDeliveryType.PULL && pushEndpoint != null) {
    console.warn(
      'Warning: You have provided a `pushEndpoint` URL, but this will be ignored as you have also set `deliveryType=PULL`. Change this to `deliveryType=PUSH` if you want to create a Push Subscription.',
    )
  }

  if (pushEndpoint != null && pushEndpoint !== pushEndpoint.trim()) {
    console.warn(
      'Warning: Your `pushEndpoint` has untrimmed spaces. This may cause you issues with Google Cloud PubSub.',
    )
  }
  if (
    serviceAccountEmail != null &&
    serviceAccountEmail !== serviceAccountEmail.trim()
  ) {
    console.warn(
      'Warning: Your `serviceAccountEmail` has untrimmed spaces. This may cause you issues with Google Cloud PubSub.',
    )
  }
  if (audience != null && audience !== audience.trim()) {
    console.warn(
      'Warning: Your `audience` has untrimmed spaces. This may cause you issues with Google Cloud PubSub.',
    )
  }

  if (ackDeadlineSeconds != null) {
    if (ackDeadlineSeconds < 10) {
      console.warn(
        'Warning: Your `ackDeadlineSeconds` is less than the minimum value of 10.',
      )
    } else if (ackDeadlineSeconds > 600) {
      console.warn(
        'Warning: Your `ackDeadlineSeconds` is greater than the maximum value of 600.',
      )
    }
  }
}

const createDriver = (createDriverOptions: CreateDriverOptions) => {
  const { clientConfig } = createDriverOptions

  validateCreateDriverOptions(createDriverOptions)

  return {
    publish: async (message: AnyMessage) => {
      const { type: topicName } = message
      const dataBuffer = Buffer.from(JSON.stringify(message), 'utf8')
      const topic = await createTopic(clientConfig, topicName)
      await topic.publish(dataBuffer)
    },
    subscribe: (subscribeOptions: SubscribeOptions) => {
      return subscribe(createDriverOptions, subscribeOptions)
    },
  }
}

export default createDriver
export * from './types'
