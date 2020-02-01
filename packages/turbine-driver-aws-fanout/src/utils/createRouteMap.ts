import { SubscriptionHandler } from '@zwolf/turbine'

import { RouteMap } from './types'

const createRouteMap = (
  subscriptionHandlers: SubscriptionHandler[],
): RouteMap => {
  const routeMap = subscriptionHandlers.reduce((map, subscriptionHandler) => {
    const { type, handlerFn } = subscriptionHandler
    map.set(type, handlerFn)
    return map
  }, new Map())
  return routeMap
}

export default createRouteMap
