![Turbine](./turbine.png)

> A minimal library for event based microservices

```javascript
import createService from '@stayradiated/turbine'
import createAmqpDriver from '@stayradiated/turbine-driver-amqplib'

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
npm install --save @stayradiated/turbine
```

As well as a driver to use.

- `@stayradiated/turbine-driver-amqplib`
- `@stayradiated/turbine-driver-aws-fanout`
- `@stayradiated/turbine-driver-mock`

## Development

```
git clone https://github.com/stayradiated/turbine
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
