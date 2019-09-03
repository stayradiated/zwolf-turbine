export const PORT = parseInt(process.env.PORT, 10) || null

export const AWS_FANOUT_LOG_QUEUE = 'logger'
export const AWS_FANOUT_DEAD_LETTER_QUEUE = 'deadLetter'
export const AWS_FANOUT_MAX_RECEIVE_COUNT = 5
