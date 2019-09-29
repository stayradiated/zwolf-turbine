import createService from '@mishguru/turbine'
import createDriver from './index'

const service = createService({
  serviceName: 'my-service',
  driver: createDriver()
})

service.handle('greet', async (message) => {
  const { payload } = message
  const { name, text } = payload
  console.log(`Received greeting "${text}" from ${name}`)
})

void async function main () {
  await service.start()

  await service.dispatch({
    type: 'greet',
    payload: {
      name: 'george',
      text: 'hi there!'
    }
  })
}()
