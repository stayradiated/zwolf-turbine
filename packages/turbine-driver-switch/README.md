# Turbine Driver: Switch

> Switch between different turbine drivers using an environment variable.

```javascript
import createDriver from '@zwolf/turbine-driver-switch'
import createService from '@zwolf/turbine'

const service = createService({
  name: 'myService',
  driver: createDriver({
    defaultDriver: '@zwolf/turbine-driver-aws-fanout'
  })
})

...
```


```shell
TURBINE_DRIVER=@zwolf/turbine-driver-amqp npm start
TURBINE_DRIVER_ARGS_JSON='{"url":"amqp://localhost"}'
```
