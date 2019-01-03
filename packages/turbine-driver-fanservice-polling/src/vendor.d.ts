declare type Credentials = {
  region: string
  accessKeyId: string
  secretAccessKey: string
}

declare type FanserviceMessage = {
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

declare type ReceivedMessage = {
  MessageId: string
  Body: string
  ReceiptHandle: string
  MD5OfBody: string
}

declare type ReceivedMessageList = {
  Messages: ReceivedMessage[]
  ResponseMetadata: {
    RequestId: string
  }
}

declare module '@mishguru/fanout-helpers' {
  export function getAwsCredentials(): Credentials
  export function getFanoutEnv(): string
  export function createFanoutForEnvironment(
    credentials: Credentials,
    fanoutEnv: string,
  ): Promise<void>
  export function authenticatedPublish(
    type: string,
    payload: object,
  ): Promise<void>
  export function rejectAnyway(
    type: string,
    payload: object,
    error: Error,
  ): Promise<void>
  export function decodeNameFromTopicArn(fanoutEnv: string, arn: string): string
  export function authenticatedReceiveMessage(
    numberOfMessages: number,
    secondsToWait: number,
    queueName: string,
  ): Promise<ReceivedMessageList>
  export function authenticatedDeleteMessage(
    queueName: string,
    receiptHandle: string
  ): Promise<void>
}

declare module '@mishguru/raven-helper' {
  export default class Raven {
    static captureException (error: Error): void
  }
}
