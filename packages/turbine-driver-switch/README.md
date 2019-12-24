# Turbine Driver: Switch

> Switch between different turbine drivers using an environment variable.

```javascript
import createDriver from '@stayradiated/turbine-driver-switch'
import createService from '@stayradiated/turbine'

const service = createService({
  name: 'myService',
  driver: createDriver({
    defaultDriver: '@stayradiated/turbine-driver-aws-fanout'
  })
})

...
```


```shell
TURBINE_DRIVER=@stayradiated/turbine-driver-amqp npm start
TURBINE_DRIVER_ARGS_JSON='{"url":"amqp://localhost"}'
```
