import mem from 'mem'
import { PubSub } from '@google-cloud/pubsub'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'

const createPubSub = mem((config: ClientConfig) => {
  return new PubSub(config)
})

export default createPubSub
