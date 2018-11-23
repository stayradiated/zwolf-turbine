import { Channel } from 'amqplib'
import { Message } from '@mishguru/turbine-types'

import { EXCHANGE } from './config'

const publish = async (channel: Channel, message: Message) => {
  const buffer = Buffer.from(JSON.stringify(message))
  await channel.publish(EXCHANGE, message.type, buffer)
}

export default publish
