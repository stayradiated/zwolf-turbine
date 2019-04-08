import { getAwsCredentials, getFanoutEnv } from '@mishguru/fanout-helpers'

interface Credentials {
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
}

export const FANOUT_ENV = getFanoutEnv()
export const AWS_CREDENTIALS = getAwsCredentials() as Credentials
