import memoize from 'memoizee'
import amqp from 'amqplib'
import  { Message, SubscribeOptions } from '@mishguru/turbine-types'

import subscribe from './subscribe'
import publish from './publish'

import { EXCHANGE } from './config'

const createChannel = async (url: string) => {
  const conn = await amqp.connect(url)
  const channel = await conn.createChannel()
  channel.assertExchange(EXCHANGE, 'topic', { durable: false })
  return channel
}

const assertChannel = memoize(createChannel, { promise: true })

const createDriver = (url: string) => {
  return {
    publish: async (message: Message) => {
      const channel = await assertChannel(url)
      return publish(channel, message)
    },
    subscribe: async (options: SubscribeOptions) => {
      const channel = await assertChannel(url)
      return subscribe(channel, options)
    }
  }
}

export default createDriver
