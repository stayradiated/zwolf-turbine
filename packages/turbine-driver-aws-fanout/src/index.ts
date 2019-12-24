import { Driver } from '@stayradiated/turbine'

import subscribe from './subscribe'
import publish from './publish'

const createDriver = (): Driver => ({
  publish,
  subscribe,
})

export default createDriver
