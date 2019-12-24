import {
  PublishFn,
  SubscribeFn,
  SubscriptionHandlerFn,
  AnyMessage,
} from '@stayradiated/turbine'

type EventMap = Map<string, SubscriptionHandlerFn[]>
type MessageList = AnyMessage[]

const STAR_TYPE = '*'

const mockPublish = (
  eventMap: EventMap,
  messageList: MessageList,
): PublishFn => {
  return async (message) => {
    const { type } = message

    messageList.push(message)

    const handlers: SubscriptionHandlerFn[] = []

    if (eventMap.has(type)) {
      handlers.push(...eventMap.get(type))
    }

    if (eventMap.has(STAR_TYPE)) {
      handlers.push(...eventMap.get(STAR_TYPE))
    }

    await Promise.all(handlers.map((handler) => handler(message)))
  }
}

const mockSubscribe = (
  eventMap: EventMap,
  messageList: MessageList,
): SubscribeFn => {
  return async (options) => {
    options.events.forEach((event) => {
      const [type, handler] = event
      if (eventMap.has(type) === false) {
        eventMap.set(type, [])
      }
      eventMap.get(type).push(handler)
    })

    return messageList
  }
}

const createDriver = () => {
  const eventMap = new Map<string, SubscriptionHandlerFn[]>()
  const messageList = new Array<AnyMessage>()

  return {
    publish: mockPublish(eventMap, messageList),
    subscribe: mockSubscribe(eventMap, messageList),
  }
}

export default createDriver
