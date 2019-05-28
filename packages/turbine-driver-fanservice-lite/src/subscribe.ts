import { SubscribeOptions } from '@mishguru/turbine-types'

type Fn = (a: SubscribeOptions) => Promise<void>

const subscribe: Fn = async (options) => {
  console.log('Ignoring subscription hook')
}

export { subscribe }
