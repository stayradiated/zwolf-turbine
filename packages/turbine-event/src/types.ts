import { DispatchFn, HandlerFn, Message, MessageTemplate } from '@zwolf/turbine'

export interface Event<RequestPayload, SuccessPayload, FailurePayload> {
  request: EventStatus<RequestPayload>,
  success: EventStatus<SuccessPayload>,
  failure: EventStatus<FailurePayload>,
}

export type MessageTemplateCreator<Payload> = (
  payload: Payload,
) => MessageTemplate<Payload>

export type HandlerFnCreator<Payload> = (
  handlerFn: HandlerFn<Payload>,
) => HandlerFn<Payload>

export interface EventStatus<Payload> {
  type: string,
  createMessage: MessageTemplateCreator<Payload>,
  createHandler: HandlerFnCreator<Payload>,
}

export type ResultHandler<V, I, R, S, F> = (
  value: V,
  event: Event<R, S, F>,
  message: Message<I>,
  dispatch: DispatchFn,
) => Promise<void>
