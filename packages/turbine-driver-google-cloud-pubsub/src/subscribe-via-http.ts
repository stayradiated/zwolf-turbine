import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { SubscribeOptions } from '@zwolf/turbine'
import { Subscription } from '@google-cloud/pubsub'

import { PORT } from './constants'

interface ServerOptions {
  requestTimeoutSeconds: number,
}

const subscribeViaHTTP = async (
  createSubscriptions: () => Promise<Subscription[]>,
  subscribeOptions: SubscribeOptions,
  serverOptions: ServerOptions,
) => {
  const { subscriptionHandlers } = subscribeOptions
  const { requestTimeoutSeconds } = serverOptions

  const app = express()

  app.use(bodyParser.json())

  app.post('/refresh-subscriptions', async (req: Request, res: Response) => {
    await createSubscriptions()
    res.status(200).end()
  })

  app.post('/', async (req: Request, res: Response) => {
    if (!req.body) {
      const msg = 'no Pub/Sub message received'
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    if (!req.body.message) {
      const msg = 'invalid Pub/Sub message format'
      console.error(`error: ${msg}`)
      res.status(400).send(`Bad Request: ${msg}`)
      return
    }

    try {
      const message = JSON.parse(
        Buffer.from(req.body.message.data, 'base64').toString('utf8'),
      )

      await Promise.all(
        subscriptionHandlers
          .filter((subscriptionHandler) => {
            return subscriptionHandler.type === message.type
          })
          .map((subscriptionHandler) => {
            return subscriptionHandler.handlerFn(message)
          }),
      )

      res.status(204).end()
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .send(`Server Error: ${error.message}`)
        .end()
    }
  })

  const server = app.listen(PORT, () => {
    console.info(`Listening for messages on port ${PORT}`)
  })

  server.setTimeout(requestTimeoutSeconds * 1000)
}

export default subscribeViaHTTP
