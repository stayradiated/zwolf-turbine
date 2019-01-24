import { SubscribeOptions, SubscriptionHandlerFn } from '@mishguru/turbine-types'
import { parseRawMessage, FANOUT_ENV, AWS_CREDENTIALS } from '@mishguru/turbine-utils-fanservice'
import {
  FanserviceMessage,
  createFanoutForEnvironment,
  authenticatedDeleteMessage,
  authenticatedReceiveMessage,
  rejectAnyway,
} from '@mishguru/fanout-helpers'

type RouteMap = Map<string, SubscriptionHandlerFn>

const HEALTH_CHECK = async (): Promise<void> => undefined

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  const routeMap: RouteMap = events.reduce((map, event) => {
    const [type, callback] = event
    map.set(type, callback)
    return map
  }, new Map())

  console.log('Subscribing to the following gevents:')
  for (const key of routeMap.keys()) {
    console.log(`- ${key}`)
  }

  console.info('Updating fanout environment...')
  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

  console.info('Polling for messages...')
  await pollForMessages(routeMap, serviceName)
}

const pollForMessages = async (routeMap: RouteMap, serviceName: string): Promise<void> => {
  try {
    const res = await authenticatedReceiveMessage(1, 60, serviceName)

    if (res != null && res.Messages != null && res.Messages.length > 0) {
      await Promise.all(res.Messages.map(async (message) => {
        await handleMessage(routeMap, serviceName, JSON.parse(message.Body))
        await authenticatedDeleteMessage(serviceName, message.ReceiptHandle)
      }))
    }
  } catch (error) {
    console.error('Error polling for messages!', error)
  } finally {
    return pollForMessages(routeMap, serviceName)
  }
}

const handleMessage = async (routeMap: RouteMap, serviceName: string, rawMessage: FanserviceMessage) => {
  const message = parseRawMessage(rawMessage)
  const { id, sentAt, type, payload } = message

  if (routeMap.has(type) === false) {
    console.info(`Warning! Unhandled event received: "${type}"`)
  } else {
    console.info(`--- ${type} ---\n${JSON.stringify(payload, null, 2)}\n`)
    const callback = routeMap.get(type)
    try {
      await callback({
        id,
        sentAt,
        type,
        payload,
      })
    } catch (error) {
      console.error(`Error handling "${type}" message!`, error)

      if (error != null || error.published === true) {
        const userId = payload.userId || 0

        return rejectAnyway(
          'unexpectedError',
          {
            userId,
            message,
            info: `Unexpected error in "${serviceName}"`,
            error: error.message,
          },
          error,
        )
      }

      throw error
    }
  }
}

export default subscribe
