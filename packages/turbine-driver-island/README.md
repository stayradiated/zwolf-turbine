# Turbine driver for @mishguru/island

```javascript
process.env.TURBINE_DRIVER = '@mishguru/turbine-driver-island'

const { default: service } = require('./autoforward/dist/service')

const events = await service.start()
```
