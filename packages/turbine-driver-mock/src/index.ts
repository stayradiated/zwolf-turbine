import { PublishFn, SubscribeFn } from '@mishguru/turbine-types'

interface Options {
  publish?: PublishFn
  subscribe?: SubscribeFn
}

const mockPublish: PublishFn = async (message) => {
  console.log(`Publishing message: ${JSON.stringify(message, null, 2)}`)
}

const mockSubscribe: SubscribeFn = async (options) => {
  options.events.forEach((event) => {
    const [type] = event
    console.log(`Subscribing to message type: "${type}"`)
  })
}

const createDriver = (options: Options = {}) => {
  const { publish = mockPublish, subscribe = mockSubscribe } = options

  return {
    publish,
    subscribe,
  }
}

export default createDriver
