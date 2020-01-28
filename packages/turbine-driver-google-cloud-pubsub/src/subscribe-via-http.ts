import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { SubscribeOptions } from '@stayradiated/turbine'

import { PORT } from './constants'

const subscribeViaHTTP = async (subscribeOptions: SubscribeOptions) => {
  const { subscriptionHandlers } = subscribeOptions

  const app = express()

  app.use(bodyParser.json())

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

  server.setTimeout(60 * 60 * 1000) // 1 hour
}

export default subscribeViaHTTP
