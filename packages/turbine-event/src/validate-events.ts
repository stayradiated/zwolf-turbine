import { TestInterface } from 'ava'

type EventList = Record<string, Record<string, any>>

const validateEvents = (
  test: TestInterface,
  eventList: EventList,
  skipProperties: string[] = [],
) => {
  for (const property in eventList) {
    if (eventList.hasOwnProperty(property) === false) {
      continue
    }

    if (skipProperties.includes(property)) {
      continue
    }

    const commands = eventList[property]
    for (const command in commands) {
      if (commands.hasOwnProperty(command) === false) {
        continue
      }

      const eventHandler = (commands as any)[command]

      test(`${property}.${command}`, (t) => {
        t.is(eventHandler.request.type, `${property}.${command}.request`)
        t.is(eventHandler.success.type, `${property}.${command}.success`)
        t.is(eventHandler.failure.type, `${property}.${command}.failure`)
      })
    }
  }
}

export default validateEvents
