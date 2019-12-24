import { FANOUT_ENV } from './constants'

const withFanoutEnvPrefix = (name: string) => {
  return FANOUT_ENV + '-' + name
}

export default withFanoutEnvPrefix
