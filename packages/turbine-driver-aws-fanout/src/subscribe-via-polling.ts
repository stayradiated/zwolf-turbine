import { v2 as fanout } from 'aws-fanout'
import { AWS_CREDENTIALS } from '@mishguru/turbine-utils-fanservice'
import {
  RouteMap,
  handleFanserviceMessage,
} from '@mishguru/turbine-utils-fanservice'

import withFanoutEnvPrefix from './with-fanout-env-prefix'

interface PollForMessagesOptions {
  routeMap: RouteMap,
  serviceName: string,
}

const pollForMessages = async (
  options: PollForMessagesOptions,
): Promise<void> => {
  const { routeMap, serviceName } = options

  try {
    const queueName = withFanoutEnvPrefix(serviceName)

    console.info(`Polling queue "${queueName}" for messages...`)

    const res = await fanout.receiveMessage(AWS_CREDENTIALS, {
      maxNumberOfMessages: 5,
      visibilityTimeout: 120,
      queueName,
    })

    const messages = res != null && res.Messages != null ? res.Messages : []

    console.info(`...received ${messages.length} message(s)`)

    await Promise.all(
      messages.map(async (message) => {
        await handleFanserviceMessage(
          serviceName,
          routeMap,
          JSON.parse(message.Body),
        )
        await fanout.deleteMessage(AWS_CREDENTIALS, {
          queueName,
          receiptHandle: message.ReceiptHandle,
        })
      }),
    )
  } catch (error) {
    console.error('Error polling for messages!', error)
  }

  return pollForMessages(options)
}

interface SubscribeViaPollingOptions {
  routeMap: RouteMap,
  serviceName: string,
}

const subscribeViaPolling = (options: SubscribeViaPollingOptions) => {
  return pollForMessages(options)
}

export default subscribeViaPolling
