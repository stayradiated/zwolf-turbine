import { SubscribeOptions } from '@mishguru/turbine'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { v2 as fanout } from 'aws-fanout'

import {
  createRouteMap,
  handleFanserviceMessage,
  FANOUT_ENV,
  AWS_CREDENTIALS,
} from '@mishguru/turbine-utils-fanservice'

const PORT = process.env.PORT || 8080

const AWS_FANOUT_DEAD_LETTER_QUEUE = 'deadLetter'
const AWS_FANOUT_MAX_RECEIVE_COUNT = 5

const subscribe = async (subscribeOptions: SubscribeOptions) => {
  const { serviceName, events } = subscribeOptions

  if (events.length === 0) {
    return
  }

  const queueName = FANOUT_ENV + '-' + serviceName
  const topicNames = events.map(([topic]) => FANOUT_ENV + '-' + topic)

  console.log(`Listening to queue: ${queueName}`)
  await fanout.setQueuePolicy(AWS_CREDENTIALS, {
    queueName,
    topicNames,
    ignoreExistingPolicy: false,
  })

  await Promise.all(
    topicNames.map((topicName) => {
      console.log(`Subscribing to topic: ${topicName}`)
      return fanout.subscribeQueueToTopic(AWS_CREDENTIALS, {
        queueName,
        topicName,
      })
    }),
  )

  const deadLetterQueueName = FANOUT_ENV + '-' + AWS_FANOUT_DEAD_LETTER_QUEUE
  const maxReceiveCount = AWS_FANOUT_MAX_RECEIVE_COUNT

  console.log(`Using dead letter queue: ${deadLetterQueueName}`)
  console.log(`Using max receive count: ${maxReceiveCount}`)

  await fanout.setQueueRedrivePolicy(AWS_CREDENTIALS, {
    queueName,
    deadLetterQueueName,
    maxReceiveCount,
  })

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

  app.listen(PORT, () => {
    console.info(`Listening for messages localhost:${PORT}/handle`)
  })
}

export default subscribe
