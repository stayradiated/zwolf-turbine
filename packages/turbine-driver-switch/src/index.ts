type Options = {
  defaultDriver?: string
}

const createDriver = (options: Options) => {
  const { defaultDriver } = options
  const { TURBINE_DRIVER, TURBINE_DRIVER_ARGS_JSON } = process.env

  const driverName = typeof TURBINE_DRIVER === 'string' && TURBINE_DRIVER.trim().length > 0
    ? TURBINE_DRIVER
    : defaultDriver

  if (typeof driverName !== 'string' || driverName.trim().length === 0) {
    throw new Error('Invalid turbine driver name supplied to turbine-driver-switch.')
  }

  const driverConfig = TURBINE_DRIVER_ARGS_JSON ? JSON.parse(TURBINE_DRIVER_ARGS_JSON) : {}

  console.info(`[turbine] Using driver "${driverName}"`)

  const { default: createDriver } = require(driverName)
  return createDriver(driverConfig)
}

export default createDriver
