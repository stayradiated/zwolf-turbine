import test from 'ava'

import createMessageTemplateCreator from './create-message-template-creator'

interface Payload {
  name: string,
}

const TYPE = 'type'

test('Should create a MessageTemplateCreator', (t) => {
  const createMessageTemplate = createMessageTemplateCreator<Payload>(TYPE)
  const payload = { name: 'name' }
  const result = createMessageTemplate(payload)
  t.deepEqual(result, { type: TYPE, payload })
})
