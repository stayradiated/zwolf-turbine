import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import { SubscribeOptions } from '@stayradiated/turbine'

import createPullSubscription from './create-pull-subscription'

const subscribeViaPolling = async (
  config: ClientConfig,
  options: SubscribeOptions,
) => {
  const { serviceName, events } = options

  await Promise.all(
    events.map(async (event) => {
      const [topicName, handle] = event

      const subscriptionName = `pull-${serviceName}+${topicName}`
      const subscription = await createPullSubscription({
        config,
        topicName,
        subscriptionName,
      })

      subscription.on('message', async (pubSubMessage) => {
        const message = JSON.parse(pubSubMessage.data.toString('utf8'))
        await handle(message)
        pubSubMessage.ack()
      })
    }),
  )
}

export default subscribeViaPolling
