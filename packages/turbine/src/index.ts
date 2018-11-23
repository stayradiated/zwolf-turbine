import { v4 as uuid } from 'uuid'
import { Service, ServiceConfig, Message, SubscribeFn, DispatchOptions } from '@mishguru/turbine-types'

const createService = (config: ServiceConfig): Service => {
  const { serviceName, driver } = config

  const createDispatch = (parent?: Message) => (options: DispatchOptions) => {
    const { type, payload } = options
    const message = {
      id: uuid(),
      parentId: parent != null ? parent.id : null,
      sentAt: Date.now(),
      type,
      payload,
    }
    return driver.publish(message)
  }

  const events: Array<[string, SubscribeFn]> = []
  const hasStarted = false

  return {
    async handle (type, handlerFn) {
      if (hasStarted) {
        throw new Error('Cannot add new event after service has started.')
      }
      const callback = async (message: Message) => {
        const dispatch = createDispatch(message)
        await handlerFn(message, dispatch)
      }
      events.push([type, callback])
    },

    dispatch (options) {
      return createDispatch(null)(options)
    },

    async start () {
      await driver.subscribe({ serviceName, events })
    }
  }
}

export default createService
