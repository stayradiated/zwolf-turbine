export type PublishFn = (message: AnyMessage) => Promise<void>
export type SubscriptionHandlerFn = (message: AnyMessage) => Promise<void>
export type SubscribeFn = (options: SubscribeOptions) => Promise<any>
export type HandlerFn = (
  message: AnyMessage,
  dispatch: DispatchFn,
) => Promise<void>
export type DispatchFn = (message: MessageTemplate) => Promise<AnyMessage>

export type Event = [string, SubscriptionHandlerFn]
export type EventList = Array<Event>

export type MessageTemplate = {
  type: string
  payload: any
}

export type Message<T> = {
  id: string
  parentId?: string
  sentFrom?: string
  sentAt: number
  type: string
  payload: T
}

export type AnyMessage = Message<any>

export type SubscribeOptions = {
  serviceName: string
  events: EventList
}

export type Driver = {
  publish: PublishFn
  subscribe: SubscribeFn
}

export type ServiceConfig = {
  serviceName: string
  driver: Driver
}

export interface Service {
  handle(type: string, callback: HandlerFn): Promise<void>
  dispatch: DispatchFn
  start(): Promise<void>
}
