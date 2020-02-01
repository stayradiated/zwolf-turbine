import { HandlerFn } from '@zwolf/turbine'

import { Event, ResultHandler } from './types'

const createHandlerFn = <I, R, S, F>(options: {
  event: Event<R, S, F>,
  onSuccess: ResultHandler<any, I, R, S, F>,
  onError: ResultHandler<Error, I, R, S, F>,
}) => {
  const { event, onSuccess, onError } = options

  return (handlerFn: HandlerFn<I>): HandlerFn<I> => {
    return async (message, dispatch) => {
      try {
        const result = await handlerFn(message, dispatch)
        await onSuccess(result, event, message, dispatch)
      } catch (error) {
        await onError(error, event, message, dispatch)
      }
    }
  }
}

export default createHandlerFn
