import delay from 'delay'
import createService from '@stayradiated/turbine'
import createDriver from '@stayradiated/turbine-driver-google-cloud-pubsub'

const service = createService({
  serviceName: 'turbine-example',
  driver: createDriver(),
})

service.handle('ping', async (message, dispatch) => {
  console.log('Received PING', message)

  await delay(1000 * 1)

  console.log('Sending PONG')

  await dispatch({
    type: 'pong',
    payload: { pong: true },
  })
})

service.handle('pong', async (message, dispatch) => {
  console.log('Received PONG', message)

  await delay(1000 * 1)

  console.log('Sending PING')

  await dispatch({
    type: 'ping',
    payload: { ping: true },
  })
})

service
  .start()
  .then(() => {
    console.log('Kicking things off with a ping')
    return service.dispatch({
      type: 'ping',
      payload: {},
    })
  })
  .catch(console.error)
