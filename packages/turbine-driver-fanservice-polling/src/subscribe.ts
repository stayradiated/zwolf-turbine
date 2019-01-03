import { SubscribeOptions, SubscriptionHandlerFn } from '@mishguru/turbine-types'
import Raven from '@mishguru/raven-helper'
import {
  createFanoutForEnvironment,
  authenticatedDeleteMessage,
  authenticatedReceiveMessage,
  rejectAnyway,
} from '@mishguru/fanout-helpers'

import { FANOUT_ENV, AWS_CREDENTIALS } from './constants'
import parseRawMessage from './parseRawMessage'

type RouteMap = Map<string, SubscriptionHandlerFn>

const HEALTH_CHECK = async (): Promise<void> => undefined

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  const routeMap: RouteMap = events.reduce((map, event) => {
    const [type, callback] = event
    map.set(type, callback)
    return map
  }, new Map())

  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

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
    Raven.captureException(error)
  } finally {
    return pollForMessages(routeMap, serviceName)
  }
}

const handleMessage = async (routeMap: RouteMap, serviceName: string, rawMessage: FanserviceMessage) => {
  const message = parseRawMessage(rawMessage)
  const { type, payload } = message

  if (routeMap.has(type)) {
    const callback = routeMap.get(type)
    try {
      await callback({
        id: payload.__turbine__ != null ? payload.__turbine__.id : null,
        sentAt: payload.__turbine__ != null ? payload.__turbine.sentAt : null,
        type,
        payload,
      })
    } catch (error) {
      console.error(error)
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
