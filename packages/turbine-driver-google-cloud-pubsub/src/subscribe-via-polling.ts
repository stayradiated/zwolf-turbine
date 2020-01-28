import { Subscription } from '@google-cloud/pubsub'
import { SubscribeOptions } from '@stayradiated/turbine'

const subscribeViaPolling = async (
  subscribeOptions: SubscribeOptions,
  subscriptions: Subscription[],
) => {
  const { subscriptionHandlers } = subscribeOptions

  await Promise.all(
    subscriptionHandlers.map(async (subscriptionHandler, index) => {
      const subscription = subscriptions[index]

      subscription.on('message', async (pubSubMessage) => {
        const message = JSON.parse(pubSubMessage.data.toString('utf8'))
        await subscriptionHandler.handlerFn(message)
        pubSubMessage.ack()
      })
    }),
  )
}

export default subscribeViaPolling
