import {
  PublishFn,
  SubscribeFn,
  SubscriptionHandlerFn,
  AnyMessage,
} from '@zwolf/turbine'

type SubscriptionHandlerMap = Map<string, SubscriptionHandlerFn[]>
type MessageList = AnyMessage[]

const mockPublish = (
  subscriptionHandlerMap: SubscriptionHandlerMap,
  messageList: MessageList,
): PublishFn => {
  return async (message) => {
    const { type } = message

    messageList.push(message)

    const handlers: SubscriptionHandlerFn[] = []

    if (subscriptionHandlerMap.has(type)) {
      handlers.push(...subscriptionHandlerMap.get(type))
    }

    await Promise.all(handlers.map((handler) => handler(message)))
  }
}

const mockSubscribe = (
  subscriptionHandlerMap: SubscriptionHandlerMap,
  messageList: MessageList,
): SubscribeFn => {
  return async (options) => {
    options.subscriptionHandlers.forEach((subscriptionHandler) => {
      const { type, handlerFn } = subscriptionHandler
      if (subscriptionHandlerMap.has(type) === false) {
        subscriptionHandlerMap.set(type, [])
      }
      subscriptionHandlerMap.get(type).push(handlerFn)
    })

    return messageList
  }
}

const createDriver = () => {
  const subscriptionHandlerMap = new Map<string, SubscriptionHandlerFn[]>()
  const messageList = new Array<AnyMessage>()

  return {
    publish: mockPublish(subscriptionHandlerMap, messageList),
    subscribe: mockSubscribe(subscriptionHandlerMap, messageList),
  }
}

export default createDriver
