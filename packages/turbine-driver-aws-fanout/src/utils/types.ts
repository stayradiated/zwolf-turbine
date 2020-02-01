import { SubscriptionHandlerFn } from '@zwolf/turbine'

export type RouteMap = Map<string, SubscriptionHandlerFn>

export interface FanserviceMessage {
  Type: string,
  MessageId: string,
  TopicArn: string,
  Message: string,
  Timestamp: string,
  SignatureVersion: string,
  Signature: string,
  SigningCertURL: string,
  UnsubscribeURL: string,
}
