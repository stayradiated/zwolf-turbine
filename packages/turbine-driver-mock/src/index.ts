import {
  PublishFn,
  SubscribeFn,
  SubscriptionHandlerFn,
  AnyMessage,
} from '@mishguru/turbine-types'

type EventMap = Map<string, SubscriptionHandlerFn[]>
type MessageList = Array<AnyMessage>

const mockPublish = (
  eventMap: EventMap,
  messageList: MessageList,
): PublishFn => {
  return async (message) => {
    const { type } = message

    messageList.push(message)

    if (eventMap.has(type)) {
      await Promise.all(
        eventMap
          .get(type)
          .map((handler: SubscriptionHandlerFn) => handler(message)),
      )
    }
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
