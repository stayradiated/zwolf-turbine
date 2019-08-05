import {
  createDispatch,
  AnyMessage,
  SubscriptionHandlerFn,
} from '@mishguru/turbine'
import Raven from '@mishguru/raven-helper'
import { formatError } from '@mishguru/turbine-utils-error'

import parseFanserviceMessage from './parseFanserviceMessage'
import { RouteMap, FanserviceMessage } from './types'
import publish from './publish'

const STAR_TYPE = '*'

const handleCallback = async (
  serviceName: string,
  message: AnyMessage,
  callback: SubscriptionHandlerFn,
) => {
  const { id, sentAt, type, payload } = message

  try {
    await callback({
      id,
      sentAt,
      type,
      payload,
    })
  } catch (error) {
    console.error(`Error handling "${type}" message.`, error)
    Raven.captureException(error)

    if (error != null && !error.published) {
      const userId = payload.userId || 0

      error.published = true

      await createDispatch({
        parent: message,
        serviceName,
        publishFn: publish,
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
    await handleCallback(serviceName, message, callback)
  }

  if (routeMap.has(STAR_TYPE)) {
    handled = true
    const callback = routeMap.get(STAR_TYPE)
    await handleCallback(serviceName, message, callback)
  }

  if (handled === false) {
    console.info(`Warning! Unhandled event received: "${type}"`)
  }
}

export default handleFanserviceMessage
