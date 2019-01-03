import { SubscribeOptions } from '@mishguru/turbine-types'
import { parseRawMessage, FANOUT_ENV, AWS_CREDENTIALS } from '@mishguru/turbine-utils-fanservice'
import Raven from '@mishguru/raven-helper'
import {
  createFanoutForEnvironment,
  createServer,
  rejectAnyway,
} from '@mishguru/fanout-helpers'

const HEALTH_CHECK = async (): Promise<void> => undefined

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  const routeMap = events.reduce((map, event) => {
    const [type, callback] = event
    map.set(type, callback)
    return map
  }, new Map())

  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

  const server = await createServer(async (rawMessage) => {
    const message = parseRawMessage(rawMessage)
    const { type, payload } = message

    if (routeMap.has(type)) {
      const callback = routeMap.get(type)
      try {
        await callback({
          type,
          payload,
        })
      } catch (error) {
        console.error(error)
        Raven.captureException(error)

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
  }, HEALTH_CHECK)

  await server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri)
  })
}

export default subscribe
