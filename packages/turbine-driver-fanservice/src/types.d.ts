interface Credentials {
  region: string
  accessKeyId: string
  secretAccessKey: string
}

interface Message {
  TopicArn: string
  Message: string
}

interface Server {
  start: (fn: () => void) => Promise<void>
  log: (...message: string[]) => void
  info: {
    uri: string
  }
}

declare module '@mishguru/fanout-helpers' {
  export function getAwsCredentials(): Credentials
  export function getFanoutEnv(): string
  export function createFanoutForEnvironment(credentials: Credentials, fanoutEnv: string): Promise<void>
  export function authenticatedPublish(type: string, payload: object): Promise<void>
  export function rejectAnyway(type: string, payload: object, error: Error): Promise<void>
  export function decodeNameFromTopicArn(fanoutEnv: string, arn: string): string
  export function createServer(handler: (message: Message) => Promise<void>, healthCheck: () => Promise<void>): Promise<Server>
}
