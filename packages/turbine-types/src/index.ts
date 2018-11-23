export interface Message {
  id: string
  parentId: string
  sentAt: number
  type: string
  payload: any
}

export type SubscribeFn = (message: Message) => Promise<void>

export interface SubscribeOptions {
  serviceName: string
  events: Array<[string, SubscribeFn]>
}

export interface Driver {
  publish(message: Message): Promise<void>
  subscribe(options: SubscribeOptions): Promise<void>
}

export interface ServiceConfig {
  serviceName: string
  driver: Driver
}

export type DispatchFn = (options: {
  type: string
  payload: any
}) => Promise<void>

export type HandlerFn = (message: Message, dispatch: DispatchFn) => void

export interface DispatchOptions {
  type: string
  payload: any
}

export interface Service {
  handle(type: string, callback: HandlerFn): Promise<void>
  dispatch(options: DispatchOptions): Promise<void>
  start(): Promise<void>
}
