import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { PORT } from './constants'

const subscribeViaHTTP = () => {
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
      const pubSubMessage = req.body.message
      const payload = JSON.parse(
        Buffer.from(pubSubMessage.data, 'base64').toString('utf8'),
      )

      console.log('req.body', req.body)
      console.log('PAYLOAD', payload)

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
    console.info(`Listening for messages localhost:${PORT}/handle`)
  })

  server.setTimeout(60 * 60 * 1000) // 1 hour
}

export default subscribeViaHTTP
