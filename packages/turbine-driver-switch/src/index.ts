const createDriver = (driverName: string) => {
  const { default: createDriver } = require(driverName)
  return createDriver()
}

export default createDriver
