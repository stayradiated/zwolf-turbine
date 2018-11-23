import createService from '@mishguru/turbine'
import createAmqplibDriver from '@mishguru/turbine-driver-amqplib'
import createFanserviceDriver from '@mishguru/turbine-driver-fanservice'

const service = createService({
  serviceName: 'something-amazing',
  // driver: createAmqplibDriver('amqp://localhost')
  driver: createFanserviceDriver()
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
