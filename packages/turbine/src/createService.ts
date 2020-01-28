import {
  Service,
  ServiceConfig,
  AnyMessage,
  SubscriptionHandler,
} from './types'

import createDispatch from './createDispatch'

const createService = (config: ServiceConfig): Service => {
  const { serviceName, driver } = config

  const subscriptionHandlers = [] as SubscriptionHandler[]
  const hasStarted = false

  return {
    async handle (type, handlerFn) {
      if (hasStarted) {
        throw new Error('Cannot add new handler after service has started.')
      }
      const callback = async (message: AnyMessage) => {
        const dispatch = createDispatch({
          parent: message,
          serviceName,
          publishFn: driver.publish,
        })
        await handlerFn(message, dispatch)
      }
      subscriptionHandlers.push({ type, handlerFn: callback })
    },

    dispatch (options) {
      return createDispatch({
        parent: null,
        serviceName,
        publishFn: driver.publish,
      })(options)
    },

    async start (): Promise<any> {
      return driver.subscribe({ serviceName, subscriptionHandlers })
    },
  }
}

export default createService
