const formatError = (error: Error) => {
  return {
    message: error.toString(),
    stack: error.stack.toString(),
  }
}

export default formatError
