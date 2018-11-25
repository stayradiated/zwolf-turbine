import { Driver } from '@mishguru/turbine-types'

import subscribe from './subscribe'
import publish from './publish'

const createDriver = (driverOptions: DriverOptions): Driver => ({
  publish,
  subscribe: (subscribeOptions) => subscribe(driverOptions, subscribeOptions),
})

export default createDriver
