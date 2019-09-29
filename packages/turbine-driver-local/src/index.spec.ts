import test from 'ava'
import { createMessage } from '@mishguru/turbine'

import createDriver from './index'

const PAYLOAD = 'payload'

test('should listen for a regular event', async (t) => {
  const driver = createDriver()

  t.plan(1)

  await driver.subscribe({
    serviceName: 'test-1',
    events: [
      ['test', async (message) =>{
        t.is(message.payload, PAYLOAD)
      }]
    ]
  })

  await driver.publish(createMessage({
    type: 'test',
    payload: PAYLOAD
  }))
})

test('should listen for any event', async (t) => {
  const driver = createDriver()

  t.plan(2)

  await driver.subscribe({
    serviceName: 'test-2',
    events: [
      ['*', async (message) =>{
        t.is(message.type, 'test')
        t.is(message.payload, PAYLOAD)
      }]
    ]
  })

  await driver.publish(createMessage({
    type: 'test',
    payload: PAYLOAD
  }))
})
