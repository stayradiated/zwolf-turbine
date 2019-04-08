import { SubscribeOptions } from '@mishguru/turbine-types'
import {
  createRouteMap,
  RouteMap,
  handleFanserviceMessage,
  FANOUT_ENV,
  AWS_CREDENTIALS,
} from '@mishguru/turbine-utils-fanservice'
import {
  createFanoutForEnvironment,
  authenticatedDeleteMessage,
  authenticatedReceiveMessage,
} from '@mishguru/fanout-helpers'

const pollForMessages = async (
  routeMap: RouteMap,
  serviceName: string,
): Promise<void> => {
  try {
    const res = await authenticatedReceiveMessage(1, 60, serviceName)

    if (res != null && res.Messages != null && res.Messages.length > 0) {
      await Promise.all(
        res.Messages.map(async (message) => {
          await handleFanserviceMessage(
            serviceName,
            routeMap,
            JSON.parse(message.Body),
          )
          await authenticatedDeleteMessage(serviceName, message.ReceiptHandle)
        }),
      )
    }
  } catch (error) {
    console.error('Error polling for messages!', error)
  }

  return pollForMessages(routeMap, serviceName)
}

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  const routeMap = createRouteMap(events)

  console.log('Subscribing to the following gevents:')
  for (const key of routeMap.keys()) {
    console.log(`- ${key}`)
  }

  console.info('Updating fanout environment...')
  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

  console.info('Polling for messages...')

  // this is not awaited on purpose, because it never returns
  pollForMessages(routeMap, serviceName)
}

export default subscribe
