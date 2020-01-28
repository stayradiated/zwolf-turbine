import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'

export enum SubscriptionDeliveryType {
  PUSH = 'PUSH',
  PULL = 'PULL',
}

export interface OidcToken {
  serviceAccountEmail?: string,
  audience?: string,
}

export interface CreateDriverOptions {
  clientConfig?: ClientConfig,
  deliveryType: SubscriptionDeliveryType,
  pushEndpoint?: string,
  oidcToken?: OidcToken,
  ackDeadlineSeconds?: number,
}
