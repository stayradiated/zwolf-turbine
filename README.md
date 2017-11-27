# turbine

> Thinking about how we can improve fanout-helpers

```javascript
import createService from '@mishguru/service'
import db from '@mishguru/data'
import {
  LOAD_MORE_SNAPS,
  SNAPCHAT_ACCOUNT_OUT_OF_DATE
} from '@mishguru/events'

import loadMoreSnapsHandler from './handlers/loadMoreSnaps'
import snapchatAccountOutOfDateHandler from './handlers/snapchatAccountOutOfDateHandler'

const service = createService()

service.configure(require('../package.json'))

service.initializeDatabase(db)

// service.handle( [topic name], [callback] )

service.handle(LOAD_MORE_SNAPS, loadMoreSnapsHandler)

service.handle(SNAPCHAT_ACCOUNT_OUT_OF_DATE, snapchatAccountOutOfDateHandler)

service.listen()
```

## Folder Structure

Idea about how files and folders could be structured (roughly based on all
updates).

Notice that:

- There is no longer a `server.js` file (it has become `index.js`)
- All subfolders of `handlers` match a topic name
- `commands` has been renamed to `mutations` to fit in with the GraphQL
  terminology
- `queries` is still `queries` but should only be for database queries
- `topics` is a new folder
- `steps` (name could change) is used to break up the handler into multiple
  sections, but also makes it clear which order they are excecuted in. The
  steps shouldn't call each other, but instead rely on `handler/*/index.js`
  calling them in order.


```
- index.js
- handlers/
  - snapchatAccountOutOfDate/
    - index.js
    - topics/
      - allUpdatesReceived.js
      - finishedParsingAllUpdates.js
      - getStories.js
      - loadMoreSnaps.js
      - snapchatUserFoundFromReceivedSnap.js
    - mutations/
      - createFollowersAndUserFollowers.js
      - updateAttemptedAt.js
      - updatedScoresAndAuthToken.js
    - queries/
      - getFollowers.js
      - getUserFollowers.js
      - getReceivedSnapById.js
    - steps/
      - 1_getAllUpdatesIfNecessary.js
      - 2_getAndProcessAllUpdates.js
      - 3_saveResponsesToS3.js
      - 4_fireSuccessfulLoginEvents.js
      - 5_processAllUpdates.js
      - 6_saveFriends.js
      - 7_updatePrivacySettings.js
```

## The Message Object

When a message is received by the service:

1. The payload is validated by the schema. If it does not pass, an error is
   thrown and the callback is not called.
2. If the message passes validation, the callback is called with an object with
   the following properties:
   - *type*: the ID of the topic that was received
   - *payload*: an object with the payload data
   - *timestamp*: a Date instance with the time that the message was fired

## Dispatch function

Instead of calling `authenticatedPublish` or `rejectAnyway`, handlers are given
a dispatch function that can be used to publish messages.

```javascript
service.handle(DO_THE_THING, [THE_THING_HAS_BEEN_DONE], (event, dispatch) => {
  const { id } = event.payload

  dispatch({
    type: THE_THING_HAS_BEEN_DONE,
    payload: { id }
  })
})
```

The dispatch function takes an object, that is similar to a `redux` action.

- *type*: The ID of the topic to dispatch.
- *payload*: (optional) The message payload
- *error*: (optional) An Error instance

If `error` is supplied, the error message will be marked as rejected, so
that it can be thrown, and NOT logged as an `unexpectedError`.

The dispatch function knows about the parent event, so it can add the parent
event ID to the published message. This allows us to create a breadcrumb trail
of which events caused which other events to be fired.

The dispatch function also captures a stack track so that we can track where in
the code this message was published.

## Redux Actions -> Topics

Whenever we need to dispatch a message, instead of calling
`authenticatedPublish` inline with the topic details, we should create a
seperate file that returns the object properties.

```javascript
import { ADD_SNAP_TO_STORY } from '@mishguru/events'

export default addSnapToStory = ({ userId, snapId }) => ({
  type: ADD_SNAP_TO_STORY,
  payload: {
    info: `Adding snap ${snapId} to story`,
    userId,
    snapId,
  }
})
```

```
import addSnapToStory from './topics/addSnapToStory'
import createSnap from './mutations/createSnap'

export default handler = (event, dispatch) => {
  const { userId } = event.payload
  const snap = await createSnap(userId)
  await dispatch(addSnapToStory({ userId, snapId: snap.id }))
}
```

## Publishing errors

When data validation fails:

```javascript
import getFollower from './queries/getFollower'
import couldNotFindFollowerError from './topics/couldNotFindFollowerError'
import addFriend from './steps/1_addFriend'

export default handleAddFriend = (event, dispatch) => {
  const { userId, followerId } = message.payload
  const follower = await getFollower(followerId)

  if (follower == null) {
    await dispatch(couldNotFindFollowerError(followerId))
    return null
  } 

  await addFriend(userId, followerId)
}
```

When an error is thrown:

```javascript
import addFriend from './steps/1_addFriend'

export default handleAddFriend = (event, dispatch) => {
  try {
    await addFriend(message.payload.userId)
  } catch (error) {
    dispatch(addFriendError(error))
    throw error
  }
}
```

## Fanout Config

We should manage the topic shema as a text file in a git repo.

But we should access all the SQS topics through our database.

This table should NOT be edited manually, instead we should build
a tool that controls it based on the schema.

### Format

We should start with JSON Schema. In the future we should consider using
trying to convert flow types into JSON Schema.

Each topic should have a schema that looks something like this:

```json
{
 "name": "allUpdatesReceived",
 "type": "object",
 "properties": {
  "allUpdatesPath": {
    "type": "string"
  },
  "allUpdatesBucket": {
    "type": "string"
  },
  "allUpdatesS3Key": {
    "type": "string"
  },
  "allUpdatesDate": {
    "type": "string"
  },
  "userId": {
    "type": "integer"
  }
 },
 "required": [
   "allUpdatesPath", 
   "allUpdatesBucket",
   "allUpdatesS3Key",
   "allUpdatesDate",
   "userId"
 ]
}
```

### Database Table

We should create three tables in the **meta** database:

`turbineQueue`
`turbineTopic`.
`turbineTopicQueue`.

**turbineQueue**

Should have the following columns:

- `id`: primary, integer, auto incrementing
- `name`: string

Notice that queues no longer have any constraints or validation. The idea is
that all validation should be part of the topic - this means that any queue can
support any topic.

**turbineTopic**

Should have the following columns:

- `id`: primary, integer, auto incrementing
- `name`: string
- `schema`: string

**turbineTopicQueue**

Should have the following columns:

- `turbineQueueId`: primary, integer
- `turbineTopicId`: primary, integer

### Validation

It would be really neat if we could validate the schema against previous real
world events in a given time range.

This would allow us to check that any changes to the schema will not cause any
unexpected validation errors.

This is important because if we update the config in the database, any services
will pick up the ...

### Accessing topics as constants synchronously

If we want to use constants instead of strings:

```javascript
import { GET_STORIES } from '@mishguru/events'

...

dispatch({ type: GET_STORIES })
```

Then we need a way to support these without actually knowing which topics are
availble at initial runtime (because we haven't finished downloading the topic
list JSON yet).

```
> ERROR: Could not read 'GET_STORIES' of undefined.
```

But we also want a way to make sure that any typos in the topic names are
caught.

```javascript
import { GEET_STORIES } from '@mishguru/events'
```

One way to do this is to allow all constants to be accessed from
`@mishguru/events`, but keep track of them all in a set. When we have
downloaded the topic list JSON, we check that are all valid. If not, we throw
an error and stop the service.

```javascript
// mishguru/events

const TOPIC_PENDING = 'PENDING'
const TOPIC_READY = 'READY'

class Topic {
  constructor (name) {
    this.name = id
    this.status = TOPIC_PENDING
  }
}

const topics = new Map()

const proxy = new Proxy({}, {
  get (_, key) { 
    if (topics.has(key)) {
      return topics.get(key)
    }

    const value = new Topic(value)
    topics.set(key, value)
    return value
  }
})

module.exports = proxy
```

```javascript
import { GET_STORIES } from '@mishguru/events'

console.log(GET_STORIES) // { name: 'GET_STORIES', status: 'PENDING' }
```
