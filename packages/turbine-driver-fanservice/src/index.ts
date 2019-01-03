import { Driver } from '@mishguru/turbine-types'
import { publish } from '@mishguru/turbine-utils-fanservice'

import subscribe from './subscribe'

const createDriver = (): Driver => ({
  publish,
  subscribe,
})

export default createDriver
