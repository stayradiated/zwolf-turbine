import mem from 'mem'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'

import createPubSub from './create-pub-sub'

const createTopic = mem(
  async (config: ClientConfig, topicName: string) => {
    const pubsub = createPubSub(config)
    const topic = pubsub.topic(topicName)
    const [topicExists] = await topic.exists()
    if (!topicExists) {
      await pubsub.createTopic(topicName)
    }
    return topic
  },
  {
    cacheKey: JSON.stringify,
  },
)

export default createTopic
