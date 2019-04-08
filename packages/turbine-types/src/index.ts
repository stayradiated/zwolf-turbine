export type PublishFn = (message: AnyMessage) => Promise<void>
export type SubscriptionHandlerFn = (message: AnyMessage) => Promise<void>
export type SubscribeFn = (options: SubscribeOptions) => Promise<any>
export type HandlerFn = (
  message: AnyMessage,
  dispatch: DispatchFn,
) => Promise<void>
export type DispatchFn = (message: MessageTemplate) => Promise<AnyMessage>

export type Event = [string, SubscriptionHandlerFn]
export type EventList = Event[]

export interface MessageTemplate {
  type: string,
  payload: any,
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
