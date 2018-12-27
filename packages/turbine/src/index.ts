import { v4 as uuid } from 'uuid'
import {
  Service,
  ServiceConfig,
  Message,
  EventList,
  MessageTemplate,
} from '@mishguru/turbine-types'

const createMessage = (options: {
  type: string
  payload: any
  parentId?: string
}) => ({
  id: uuid(),
  sentAt: Date.now(),
  ...options,
})

const createService = (config: ServiceConfig): Service => {
  const { serviceName, driver } = config

  const createDispatch = (parent?: Message) => async (
    options: MessageTemplate,
  ) => {
    const { type, payload } = options
    const parentId = parent != null ? parent.id : null
    const message = createMessage({ type, payload, parentId })
    await driver.publish(message)
    return message
  }

  const events: EventList = []
  const hasStarted = false

  return {
    async handle(type, handlerFn) {
      if (hasStarted) {
        throw new Error('Cannot add new event after service has started.')
      }
      const callback = async (message: Message) => {
        const dispatch = createDispatch(message)
        try {
          await handlerFn(message, dispatch)
        } catch (error) {
          console.error(`Error handling "${message.type}" message!`, error)
        }
      }
      events.push([type, callback])
    },

    dispatch(options) {
      return createDispatch(null)(options)
    },

    async start(): Promise<any> {
      return driver.subscribe({ serviceName, events })
    },
  }
}

export default createService

export { createMessage }
