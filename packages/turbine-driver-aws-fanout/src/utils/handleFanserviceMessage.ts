import {
  createDispatch,
  formatError,
  AnyMessage,
  SubscriptionHandlerFn,
  PublishFn,
} from '@zwolf/turbine'

import parseFanserviceMessage from './parseFanserviceMessage'
import { RouteMap, FanserviceMessage } from './types'

const STAR_TYPE = '*'
const FALLBACK_USER_ID = 0

const handleCallback = async (
  serviceName: string,
  message: AnyMessage,
  callback: SubscriptionHandlerFn,
  publishFn: PublishFn,
) => {
  const { type, payload } = message

  try {
    await callback(message)
  } catch (error) {
    console.error(`Error handling "${type}" message.`, error)

    if (error != null && !error.published) {
      const userId = payload.userId || FALLBACK_USER_ID

      error.published = true

      await createDispatch({
        parent: message,
        serviceName,
        publishFn,
      })({
        type: 'unexpectedError',
        payload: {
          userId,
          info: `Uncaught error in "${serviceName}" while handling "${type}" message.`,
          error: formatError(error),
          message,
        },
      })
    }

    throw error
  }
}

const handleFanserviceMessage = async (
  serviceName: string,
  routeMap: RouteMap,
  rawMessage: FanserviceMessage,
  publishFn: PublishFn,
) => {
  const message = parseFanserviceMessage(rawMessage)
  const { type, payload } = message

  if (process.env.TURBINE_DEBUG) {
    console.info(`--- ${type} ---\n${JSON.stringify(payload, null, 2)}\n`)
  }

  let handled = false

  if (routeMap.has(type)) {
    handled = true
    const callback = routeMap.get(type)
    await handleCallback(serviceName, message, callback, publishFn)
  }

  if (routeMap.has(STAR_TYPE)) {
    handled = true
    const callback = routeMap.get(STAR_TYPE)
    await handleCallback(serviceName, message, callback, publishFn)
  }

  if (handled === false) {
    console.info(`Warning! Unhandled event received: "${type}"`)
  }
}

export default handleFanserviceMessage
