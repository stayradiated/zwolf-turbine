import subscribe from './subscribe'
import publish from './publish'

const createDriver = () => ({
  publish,
  subscribe,
})

export default createDriver
