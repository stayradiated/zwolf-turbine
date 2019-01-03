import { getAwsCredentials, getFanoutEnv } from '@mishguru/fanout-helpers'

type Credentials = {
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export const FANOUT_ENV = getFanoutEnv()
export const AWS_CREDENTIALS = <Credentials>getAwsCredentials()
