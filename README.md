# turbine

> A minimal library for event based microservices

```javascript
import createService from '@mishguru/turbine'
import createAmqpDriver from '@mishguru/turbine-driver-amqplib'

const service = createService({
  serviceName: 'scheduler',
  driver: createAmqpDriver({url: 'amqp://localhost'})
})

service.handle('schedule', (message, dispatch) => {
  const { payload } = message
  const { scheduledAt, messageToDispatch } = payload

  const delay = Date.now() - scheduledAt

  setTimeout(() => {
    dispatch({
      type: messageToDispatch.type,
      payload: messageToDispatch.payload
    })
  }, delay)
})

service.start()
  .then(() => console.log('Service has started'))
  .catch(console.error)
```

## Installation

You will need the core turbine service.

```shell
npm install --save @mishguru/turbine
```

As well as a driver to use.

- `@mishguru/turbine-driver-amqplib`
- `@mishguru/turbine-driver-fanservice`
- `@mishguru/turbine-driver-mock`

## Development

```
git clone https://github.com/mishguruorg/turbine
npm install
npm run bootstrap
npm run build
```

### Publishing

When publishing changes, you should not use `npm publish` manually.

Instead use:

```
npm run deploy
```
