import { getAwsCredentials, getFanoutEnv } from '@mishguru/fanout-helpers'

export const FANOUT_ENV = getFanoutEnv()
export const AWS_CREDENTIALS = getAwsCredentials()
