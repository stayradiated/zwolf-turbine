import { SubscribeOptions } from '@mishguru/turbine-types'
import {
  createRouteMap,
  handleFanserviceMessage,
  FANOUT_ENV,
  AWS_CREDENTIALS,
} from '@mishguru/turbine-utils-fanservice'
import {
  createFanoutForEnvironment,
  createServer,
  rejectAnyway,
} from '@mishguru/fanout-helpers'

const HEALTH_CHECK = async (): Promise<void> => undefined

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  const routeMap = createRouteMap(events)

  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

  const server = await createServer(async (rawMessage) => {
    await handleFanserviceMessage(serviceName, routeMap, rawMessage)
  }, HEALTH_CHECK)

  await server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri)
  })
}

export default subscribe
