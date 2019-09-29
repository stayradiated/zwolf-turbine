# @mishguru/turbine-driver-local

> A single service in-memory driver

```typescript
import createService from '@mishguru/turbine'
import createDriver from '@mishguru/turbine-driver-local'

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

  // prints: Received greeting "hi there!" from george
}()
```
