import { PublishFn, SubscribeFn } from '@mishguru/turbine'

const publish: PublishFn = async (message) => {
  console.log(`Publishing message: ${JSON.stringify(message, null, 2)}`)
}

const subscribe: SubscribeFn = async (options) => {
  return options
}

const createDriver = () => {
  return {
    publish,
    subscribe,
  }
}

export default createDriver
