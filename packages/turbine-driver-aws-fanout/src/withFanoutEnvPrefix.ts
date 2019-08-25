import { FANOUT_ENV } from '@mishguru/turbine-utils-fanservice'

const withFanoutEnvPrefix = (name: string) => {
  return FANOUT_ENV + '-' + name
}

export default withFanoutEnvPrefix
