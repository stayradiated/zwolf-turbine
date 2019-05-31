import { Channel } from 'amqplib'
import { SubscribeOptions } from '@mishguru/turbine'

import subscribeType from './subscribeType'

const subscribe = async (channel: Channel, options: SubscribeOptions) => {
  const { serviceName, events } = options

  for (const event of events) {
    const [type, callback] = event
    await subscribeType({
      channel,
      serviceName,
      type,
      callback,
    })
  }
}

export default subscribe
