export type PublishFn = (message: Message) => Promise<void>
export type SubscriptionHandlerFn = (message: Message) => Promise<void>
export type SubscribeFn = (options: SubscribeOptions) => Promise<any>
export type HandlerFn = (
  message: Message,
  dispatch: DispatchFn,
) => Promise<void>
export type DispatchFn = (message: MessageTemplate) => Promise<Message>

export type Event = [string, SubscriptionHandlerFn]
export type EventList = Array<Event>

export interface MessageTemplate {
  type: string
  payload: any
}

export interface Message {
  id: string
  parentId?: string
  sentAt: number
  type: string
  payload: any
}

export interface SubscribeOptions {
  serviceName: string
  events: EventList
}

export interface Driver {
  publish: PublishFn
  subscribe: SubscribeFn
}

export interface ServiceConfig {
  serviceName: string
  driver: Driver
}

export interface Service {
  handle(type: string, callback: HandlerFn): Promise<void>
  dispatch: DispatchFn
  start(): Promise<void>
}
