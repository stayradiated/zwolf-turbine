export type PublishFn<T = any> = (message: Message<T>) => Promise<void>
export type SubscriptionHandlerFn<T = any> = (
  message: Message<T>,
) => Promise<void>
export type SubscribeFn = (options: SubscribeOptions) => Promise<any>
export type HandlerFn<T = any> = (
  message: Message<T>,
  dispatch: DispatchFn,
) => Promise<any>
export type DispatchFn<T = any> = (
  message: MessageTemplate<T>,
) => Promise<Message<T>>

export type Event = [string, SubscriptionHandlerFn]
export type EventList = Event[]

export interface MessageTemplate<T = any> {
  type: string,
  payload: T,
}

export interface Message<T> {
  id: string,
  parentId?: string,
  sentFrom?: string,
  sentAt: number,
  type: string,
  payload: T,
}

export type AnyMessage = Message<any>

export interface SubscribeOptions {
  serviceName: string,
  events: EventList,
}

export interface Driver {
  publish: PublishFn,
  subscribe: SubscribeFn,
}

export interface ServiceConfig {
  serviceName: string,
  driver: Driver,
}

export interface Service {
  handle(type: string, callback: HandlerFn): Promise<void>,
  dispatch: DispatchFn,
  start(): Promise<any>,
}
