import { FormattedError } from './types'

const formatError = (error: Error): FormattedError => {
  return {
    message: error.toString(),
    stack: error.stack.toString(),
  }
}

export default formatError
