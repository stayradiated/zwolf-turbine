import amqp, { Channel } from 'amqplib'
import { SubscribeOptions } from '@mishguru/turbine-types'

import { EXCHANGE } from './config'
import subscribeType from './subscribeType'

const subscribe = async (channel: Channel, options: SubscribeOptions) => {
  const { serviceName, events } = options

  for (const event of events) {
    const [ type, callback ] = event
    subscribeType({
      channel,
      serviceName,
      type,
      callback
    })
  }
}

export default subscribe
