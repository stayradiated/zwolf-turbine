import { Driver } from '@mishguru/turbine-types'
import subscribe from './subscribe'
import publish from './publish'

const createDriver = (): Driver => ({
  publish,
  subscribe,
})

export default createDriver
