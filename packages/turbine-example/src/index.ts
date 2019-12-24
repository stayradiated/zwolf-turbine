import createService from '@stayradiated/turbine'
import createAmqplibDriver from '@stayradiated/turbine-driver-amqplib'

const service = createService({
  serviceName: 'something-amazing',
  driver: createAmqplibDriver({ url: 'amqp://localhost' }),
})

service.handle('debug', async (message, dispatch) => {
  console.log(message)

  dispatch({
    type: 'debug',
    payload: {
      userId: 0,
      info: 'this is a test',
    },
  })
})

service.start().catch(console.error)
