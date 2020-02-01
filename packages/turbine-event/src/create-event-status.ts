import { Event, EventStatus, ResultHandler } from './types'
import createHandlerFn from './create-handler-fn'
import createMessageTemplateCreator from './create-message-template-creator'

const createEventStatus = <I, R, S, F>(options: {
  type: string,
  event: Event<R, S, F>,
  onSuccess: ResultHandler<any, I, R, S, F>,
  onError: ResultHandler<Error, I, R, S, F>,
}): EventStatus<I> => {
  const { type, event, onSuccess, onError } = options

  const createMessage = createMessageTemplateCreator<I>(type)

  const createHandler = createHandlerFn<I, R, S, F>({
    event,
    onError,
    onSuccess,
  })

  return {
    type,
    createMessage,
    createHandler,
  }
}

export default createEventStatus
