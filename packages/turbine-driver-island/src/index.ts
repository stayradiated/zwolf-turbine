import { PublishFn, SubscribeFn } from '@mishguru/turbine-types'

const publish: PublishFn = async (message) => {
  console.log(`Publishing message: ${JSON.stringify(message, null, 2)}`)
}

const subscribe: SubscribeFn = async (options) => {
  options.events.forEach((event) => {
    const [ type, callback ] = event
    console.log(`Subscribing to message type: "${type}" with "${callback.toString().slice(0, 100)}..."`)
  })
}

const createDriver = () => {
  return {
    publish,
    subscribe,
  }
}

export default createDriver
