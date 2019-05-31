import { AnyMessage } from '@mishguru/turbine'
import { authenticatedPublish } from '@mishguru/fanout-helpers'

const publish = async (message: AnyMessage) => {
  const { type, id, parentId, sentFrom, sentAt, payload } = message
  await authenticatedPublish(type, {
    ...payload,
    __turbine__: {
      type,
      id,
      parentId,
      sentFrom,
      sentAt,
    },
  })
}

export default publish
