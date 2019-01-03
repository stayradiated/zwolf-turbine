declare module '@mishguru/fanout-helpers' {
  export type Credentials = {
    region: string
    accessKeyId: string
    secretAccessKey: string
  }

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

  export type ReceivedMessage = {
    MessageId: string
    Body: string
    ReceiptHandle: string
    MD5OfBody: string
  }

  export type ReceivedMessageList = {
    Messages: ReceivedMessage[]
    ResponseMetadata: {
      RequestId: string
    }
  }

  export interface Server {
    start: (fn: () => void) => Promise<void>
      log: (...message: string[]) => void
      info: {
        uri: string
      }
  }

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
  export function createServer(
    handler: (message: FanserviceMessage) => Promise<void>,
    healthCheck: () => Promise<void>,
  ): Promise<Server>
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
