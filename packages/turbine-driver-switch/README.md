# Turbine Driver: Switch

> Switch between different turbine drivers using an environment variable.

```javascript
import createDriver from '@mishguru/turbine-driver-switch'
import createService from '@mishguru/turbine'

const service = createService({
  name: 'myService',
  driver: createDriver({
    defaultDriver: '@mishguru/turbine-driver-fanservice'
  })
})

...
```


```shell
TURBINE_DRIVER=@mishguru/turbine-driver-fanservice-polling npm start
TURBINE_DRIVER_ARGS_JSON='{"url":"amqp://localhost"}'
```
