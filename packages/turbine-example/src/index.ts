import createService from '@mishguru/turbine'
import createAmqplibDriver from '@mishguru/turbine-driver-amqplib'
import createFanserviceDriver from '@mishguru/turbine-driver-fanservice'
import createMockDriver from '@mishguru/turbine-driver-mock'

const service = createService({
  serviceName: 'something-amazing',
  driver: createAmqplibDriver('amqp://localhost')
})

service.handle('debug', async (message, dispatch) => {
  const { payload } = message

  console.log(message)

  dispatch({
    type: 'debug',
    payload: {
      userId: 0,
      info: 'this is a test'
    }
  })
})

service.start()
  .catch(console.error) 

console.log('This is the only thing that needs to change')