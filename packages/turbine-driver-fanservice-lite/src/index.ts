import { Driver } from '@mishguru/turbine'

import { publish } from '@mishguru/turbine-utils-fanservice'
import { subscribe } from './subscribe'

type Fn = () => Driver

const createDriver: Fn = () => ({
  publish,
  subscribe,
})

export default createDriver
