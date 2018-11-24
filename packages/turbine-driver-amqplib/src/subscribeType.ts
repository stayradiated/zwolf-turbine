import { Channel } from 'amqplib'
import { SubscriptionHandlerFn } from '@mishguru/turbine-types'

import { EXCHANGE } from './config'

interface Options {
  channel: Channel
  serviceName: string
  type: string
  callback: SubscriptionHandlerFn
}

const subscribeType = async (options: Options) => {
  const { channel, serviceName, type, callback } = options

  const queue = `${serviceName}_${type}`
  await channel.assertQueue(queue)
  channel.bindQueue(queue, EXCHANGE, type)

  channel.consume(queue, async (msg) => {
    const message = JSON.parse(msg.content.toString())
    try {
      await callback(message)
    } catch {
      // failed to handle message
      return
    }
    await channel.ack(msg)
  })
}

export default subscribeType
