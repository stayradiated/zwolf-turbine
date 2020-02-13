export interface Message<Payload> {
  id: string,
  parentId?: string,
  sentFrom?: string,
  sentAt: number,
  type: string,
  payload: Payload,
}

export type PublishFn<Payload = any> = (message: Message<Payload>) => Promise<void>

export type SubscriptionHandlerFn<Payload = any> = (
  message: Message<Payload>,
) => Promise<void>

export type SubscriptionHandler<Payload = any> = {
  type: string,
  handlerFn: SubscriptionHandlerFn<Payload>,
}

export interface SubscribeOptions {
  serviceName: string,
  subscriptionHandlers: SubscriptionHandler[],
}

export type SubscribeFn = (options: SubscribeOptions) => Promise<any>

export interface MessageTemplate<Payload = any> {
  type: string,
  payload: Payload,
}

export type DispatchFn<Payload = any> = (
  message: MessageTemplate<Payload>,
) => Promise<Message<Payload>>

export type HandlerFn<Payload = any> = (
  message: Message<Payload>,
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

export interface Service<StartReturnValue> {
  handle(type: string, callback: HandlerFn): Promise<void>,
  dispatch: DispatchFn,
  start(): Promise<StartReturnValue>,
}

export interface FormattedError {
  message: string,
  stack: string,
}
