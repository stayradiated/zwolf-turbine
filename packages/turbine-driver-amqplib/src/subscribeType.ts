import { Channel } from 'amqplib'
import { SubscriptionHandlerFn } from '@stayradiated/turbine'

import { EXCHANGE } from './config'

interface Options {
  channel: Channel,
  serviceName: string,
  type: string,
  handlerFn: SubscriptionHandlerFn,
}

const subscribeType = async (options: Options) => {
  const { channel, serviceName, type, handlerFn } = options

  const queue = `${serviceName}_${type}`
  await channel.assertQueue(queue)
  channel.bindQueue(queue, EXCHANGE, type)

  await channel.consume(queue, async (msg) => {
    const message = JSON.parse(msg.content.toString())
    try {
      await handlerFn(message)
    } catch (error) {
      console.error(`Error handling "${message.type}" message!`, error)
      return
    }
    await channel.ack(msg)
  })
}

export default subscribeType
