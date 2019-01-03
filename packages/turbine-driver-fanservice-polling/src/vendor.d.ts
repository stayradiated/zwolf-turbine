declare type Credentials = {
  region: string
  accessKeyId: string
  secretAccessKey: string
}

declare type FanserviceMessage = {
  TopicArn: string
  Message: string
}

declare type ReceivedMessage = {
  Body: string
  ReceiptHandle: string
}

declare type ReceivedMessageList = {
  Messages: ReceivedMessage[]
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
