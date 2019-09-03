import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import {
  RouteMap,
  handleFanserviceMessage,
} from '@mishguru/turbine-utils-fanservice'

import { PORT } from './constants'

interface SubscribeViaHTTPOptions {
  routeMap: RouteMap,
  serviceName: string,
}

const subscribeViaHTTP = (options: SubscribeViaHTTPOptions) => {
  const { routeMap, serviceName } = options

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

export default subscribeViaHTTP
