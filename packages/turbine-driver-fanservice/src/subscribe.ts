import { SubscribeOptions } from '@mishguru/turbine-types'
import {
  createFanoutForEnvironment,
  createServer,
  rejectAnyway
} from '@mishguru/fanout-helpers'

import { FANOUT_ENV, AWS_CREDENTIALS } from './constants'
import parseRawMessage from './parseRawMessage'

const subscribe = async (options: SubscribeOptions) => {
  const { serviceName, events } = options

  const routeMap = events.reduce((map, event) => {
    const [ type, callback ] = event
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
          payload
        })
      } catch (error) {
        console.error(error)
        if (error != null || error.published === true) {
          const userId = payload.userId || 0

          return rejectAnyway('unexpectedError', {
            userId,
            message,
            info: `Unexpected error in "${serviceName}"`,
            error: error.message
          }, error)
        }

        throw error
      }
    }
  }, async () => {
    // TODO(george): have a real healthcheck
    console.log('> fake healthcheck')
  })

  await server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri)
  })
}

export default subscribe
