import { Channel } from 'amqplib'
import { SubscribeOptions } from '@zwolf/turbine'

import subscribeType from './subscribeType'

const subscribe = async (channel: Channel, options: SubscribeOptions) => {
  const { serviceName, subscriptionHandlers } = options

  for (const subscriptionHandler of subscriptionHandlers) {
    const { type, handlerFn } = subscriptionHandler
    await subscribeType({
      channel,
      serviceName,
      type,
      handlerFn,
    })
  }
}

export default subscribe
