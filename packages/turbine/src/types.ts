export interface Message<T> {
  id: string,
  parentId?: string,
  sentFrom?: string,
  sentAt: number,
  type: string,
  payload: T,
}

export type PublishFn<T = any> = (message: Message<T>) => Promise<void>

export type SubscriptionHandlerFn<T = any> = (
  message: Message<T>,
) => Promise<void>

export type SubscriptionHandler<T = any> = {
  type: string,
  handlerFn: SubscriptionHandlerFn<T>,
}

export interface SubscribeOptions {
  serviceName: string,
  subscriptionHandlers: SubscriptionHandler[],
}

export type SubscribeFn = (options: SubscribeOptions) => Promise<any>

export interface MessageTemplate<T = any> {
  type: string,
  payload: T,
}

export type DispatchFn<T = any> = (
  message: MessageTemplate<T>,
) => Promise<Message<T>>

export type HandlerFn<T = any> = (
  message: Message<T>,
  dispatch: DispatchFn,
) => Promise<any>

export type AnyMessage = Message<any>

export interface Driver {
  publish: PublishFn,
  subscribe: SubscribeFn,
}

export interface ServiceConfig {
  serviceName: string,
  driver: Driver,
}

export interface Service<T> {
  handle(type: string, callback: HandlerFn): Promise<void>,
  dispatch: DispatchFn,
  start(): Promise<T>,
}

export interface FormattedError {
  message: string,
  stack: string,
}
