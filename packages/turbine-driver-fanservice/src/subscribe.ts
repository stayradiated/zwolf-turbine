import { SubscribeOptions } from '@mishguru/turbine-types'
import {
  decodeNameFromTopicArn,
  createFanoutForEnvironment,
  getAwsCredentials,
  getFanoutEnv,
  createServer
} from '@mishguru/fanout-helpers'

const FANOUT_ENV = getFanoutEnv()
const AWS_CREDENTIALS = getAwsCredentials()

const subscribe = async (options: SubscribeOptions) => {
  const { events } = options

  const routeMap = events.reduce((map, event) => {
    const [ type, callback ] = event
    map.set(type, callback)
    return map
  }, new Map())

  await createFanoutForEnvironment(AWS_CREDENTIALS, FANOUT_ENV)

  const server = await createServer(async (message) => {
    const type = decodeNameFromTopicArn(FANOUT_ENV, message.TopicArn)
    if (routeMap.has(type)) {
      const callback = routeMap.get(type)
      const payload = JSON.parse(message.Message)
      await callback({
        type,
        payload
      })
    }
  }, async () => {
    // TODO(george): have a real healthcheck
    console.log('healthcheck')
  })

  await server.start(() => {
    server.log('info', 'Server running at: ' + server.info.uri)
  })
}

export default subscribe
