import { formatError, FormattedError } from '@zwolf/turbine'

import createEventCreator from './create-event-creator'

export interface RequiredPayload {
  userId?: string,
}

export type RequiredRequestPayload = RequiredPayload & {}

export type RequiredSuccessPayload = RequiredPayload & {
  result: any,
}

export type RequiredFailurePayload = RequiredPayload & {
  error: FormattedError,
}

const createEvent = createEventCreator<
RequiredRequestPayload,
RequiredSuccessPayload,
RequiredFailurePayload
>({
  onError: async (error, event, message, dispatch) => {
    const { userId } = message.payload
    if (message.type === event.request.type) {
      await dispatch(
        event.failure.createMessage({
          userId,
          error: formatError(error),
        }),
      )
    } else {
      await dispatch({
        type: 'error',
        payload: {
          userId,
          error: formatError(error),
        },
      })
    }
  },
  onSuccess: async (result, event, message, dispatch) => {
    if (message.type === event.request.type) {
      const { userId } = message.payload
      await dispatch(
        event.success.createMessage({
          userId,
          result,
        }),
      )
    }
  },
})

export default createEvent
