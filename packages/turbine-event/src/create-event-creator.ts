import createEventStatus from './create-event-status'
import { Event, ResultHandler } from './types'

const createEventCreator = <
  DefaultRequestPayload,
  DefaultSuccessPayload,
  DefaultFailurePayload
>(options: {
  onSuccess: ResultHandler<
  any,
  DefaultRequestPayload | DefaultFailurePayload | DefaultSuccessPayload,
  DefaultRequestPayload,
  DefaultSuccessPayload,
  DefaultFailurePayload
  >,
  onError: ResultHandler<
  Error,
  DefaultRequestPayload | DefaultFailurePayload | DefaultSuccessPayload,
  DefaultRequestPayload,
  DefaultSuccessPayload,
  DefaultFailurePayload
  >,
}) => {
  const { onSuccess, onError } = options

  const createEvent = <
    RequestPayload = DefaultRequestPayload,
    SuccessPayload = DefaultSuccessPayload,
    FailurePayload = DefaultFailurePayload
  >(
    type: string,
  ) => {
    type EventRequestPayload = DefaultRequestPayload & RequestPayload
    type EventSuccessPayload = DefaultSuccessPayload & SuccessPayload
    type EventFailurePayload = DefaultFailurePayload & FailurePayload

    const event = ({} as unknown) as Event<
    EventRequestPayload,
    EventSuccessPayload,
    EventFailurePayload
    >

    event.request = createEventStatus<
    EventRequestPayload,
    EventRequestPayload,
    EventSuccessPayload,
    EventFailurePayload
    >({
      type: type + '.request',
      event,
      onError,
      onSuccess,
    })

    event.success = createEventStatus<
    EventSuccessPayload,
    EventRequestPayload,
    EventSuccessPayload,
    EventFailurePayload
    >({
      type: type + '.success',
      event,
      onError,
      onSuccess,
    })

    event.failure = createEventStatus<
    EventFailurePayload,
    EventRequestPayload,
    EventSuccessPayload,
    EventFailurePayload
    >({
      type: type + '.failure',
      event,
      onError,
      onSuccess,
    })

    return event
  }

  return createEvent
}

export default createEventCreator
