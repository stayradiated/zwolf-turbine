import { SubscribeOptions } from '@mishguru/turbine'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { v2 as fanout } from 'aws-fanout'
import {
  createRouteMap,
  handleFanserviceMessage,
  AWS_CREDENTIALS,
} from '@mishguru/turbine-utils-fanservice'

import withFanoutEnvPrefix from './withFanoutEnvPrefix'

import {
  PORT,
  AWS_FANOUT_DEAD_LETTER_QUEUE,
  AWS_FANOUT_MAX_RECEIVE_COUNT,
} from './constants'

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  if (events.length === 0) {
    return
  }

  const queueName = withFanoutEnvPrefix(serviceName)
  const topicNames = events.map(([topic]) => withFanoutEnvPrefix(topic))
  const deadLetterQueueName = withFanoutEnvPrefix(AWS_FANOUT_DEAD_LETTER_QUEUE)
  const maxReceiveCount = AWS_FANOUT_MAX_RECEIVE_COUNT

  await Promise.all([
    fanout.setQueuePolicy(AWS_CREDENTIALS, {
      queueName,
      topicNames,
      ignoreExistingPolicy: true,
    }),
    fanout.setQueueRedrivePolicy(AWS_CREDENTIALS, {
      queueName,
      deadLetterQueueName,
      maxReceiveCount,
    }),
    ...topicNames.map((topicName) =>
      fanout.subscribeQueueToTopic(AWS_CREDENTIALS, {
        queueName,
        topicName,
      }),
    ),
  ])

  const routeMap = createRouteMap(events)

  const app = express()
  app.use(bodyParser.json())

  app.post('/handle', async (req: Request, res: Response) => {
    try {
      const rawMessage = req.body
      await handleFanserviceMessage(serviceName, routeMap, rawMessage)
      res.status(200).end()
    } catch (error) {
      console.error(error)
      res.status(500).end()
    }
  })

  const server = app.listen(PORT, () => {
    console.info(`Listening for messages localhost:${PORT}/handle`)
  })

  server.setTimeout(60 * 60 * 1000) // 1 hour
}

export default subscribe
