import { PublishFn, SubscribeFn } from '@mishguru/turbine'
import EventEmitter from 'events'

const STAR_TYPE = '*'

const publish = (ee: EventEmitter): PublishFn => {
  return async (message) => {
    const { type } = message
    ee.emit(type, message)
    ee.emit(STAR_TYPE, message)
  }
}

const subscribe = (ee: EventEmitter): SubscribeFn => {
  return async (options) => {
    const { events } = options
    for (const event of events) {
      const [type, handler] = event
      ee.on(type, handler)
    }
  }
}

const createDriver = () => {
  const ee = new EventEmitter()

  return {
    publish: publish(ee),
    subscribe: subscribe(ee),
  }
}

export default createDriver
