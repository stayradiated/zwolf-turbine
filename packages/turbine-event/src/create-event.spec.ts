import test from 'ava'
import sinon from 'sinon'
import { createMessage, formatError } from '@zwolf/turbine'

import createEvent from './create-event'

const USER_ID = 'USER_ID'
const GREET = createEvent<{ name: string }>('greet')

test('request.type', (t) => {
  t.is(GREET.request.type, 'greet.request')
})

test('success.type', (t) => {
  t.is(GREET.success.type, 'greet.success')
})

test('failure.type', (t) => {
  t.is(GREET.failure.type, 'greet.failure')
})

test('request.createMessage - should create a request event', (t) => {
  const message = GREET.request.createMessage({
    name: 'george',
    userId: USER_ID,
  })

  t.deepEqual(message, {
    type: 'greet.request',
    payload: {
      name: 'george',
      userId: USER_ID,
    },
  })
})

test('success.createMessage - should create a success event', (t) => {
  const message = GREET.success.createMessage({
    userId: USER_ID,
    result: 'result',
  })

  t.deepEqual(message, {
    type: 'greet.success',
    payload: {
      userId: USER_ID,
      result: 'result',
    },
  })
})

test('failure.createMessage - should create a failure event', (t) => {
  const message = GREET.failure.createMessage({
    userId: USER_ID,
    error: { message: 'woops', stack: '' },
  })

  t.deepEqual(message, {
    type: 'greet.failure',
    payload: {
      userId: USER_ID,
      error: { message: 'woops', stack: '' },
    },
  })
})

test('request.createHandler - should dispatch success', async (t) => {
  const handler = GREET.request.createHandler(async (message, payload) => {
    t.is(message.type, 'greet.request')
    t.deepEqual(message.payload, { userId: USER_ID, name: 'george' })
    return { success: true }
  })

  const message = createMessage(
    GREET.request.createMessage({ userId: USER_ID, name: 'george' }),
  )
  const dispatch = sinon.stub().resolves()

  await handler(message, dispatch)

  t.deepEqual(dispatch.args, [
    [
      {
        type: 'greet.success',
        payload: {
          userId: USER_ID,
          result: { success: true },
        },
      },
    ],
  ])
})

test('request.createHandler - should dispatch error', async (t) => {
  const error = new Error('something went wrong')

  const handler = GREET.request.createHandler(async (message, payload) => {
    throw error
  })

  const message = createMessage(
    GREET.request.createMessage({ userId: USER_ID, name: 'george' }),
  )
  const dispatch = sinon.stub().resolves()

  await handler(message, dispatch)

  t.deepEqual(dispatch.args, [
    [
      {
        type: 'greet.failure',
        payload: {
          userId: USER_ID,
          error: formatError(error),
        },
      },
    ],
  ])
})
