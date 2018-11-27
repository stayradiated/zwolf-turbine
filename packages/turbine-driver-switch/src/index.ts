const createDriver = (driverName: string) => {
  const createDriver = require(`@mishguru/turbine-driver-${driverName}`)
  return createDriver()
}

export default createDriver
