import { SubscriptionHandlerFn } from '@mishguru/turbine-types'

export type RouteMap = Map<string, SubscriptionHandlerFn>

export type FanserviceMessage = {
  Type: string
  MessageId: string
  TopicArn: string
  Message: string
  Timestamp: string
  SignatureVersion: string
  Signature: string
  SigningCertURL: string
  UnsubscribeURL: string
}
