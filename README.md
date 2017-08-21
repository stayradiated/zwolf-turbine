# turbine

> Thinking about how we can improve fanout-helpers

```javascript
import createService from '@mishguru/service'
import db from '@mishguru/data'
import {
  LOAD_MORE_SNAPS,
  RETRY_ALL_UPDATES,

  LOAD_MORE_SNAPS_RECEIVED,
  FINISHED_PARSING_LOAD_MORE_SNAPS,
  LOAD_MORE_SNAPS_AGAIN,

  FINISHED_PARSING_ALL_UPDATES
  GET_STORIES
  ALL_UPDATES_RECEIVED,
  SNAPCHAT_USER_FOUND_FROM_RECEIVED_SNAP
} from '@mishguru/events'

import loadMoreSnapsHandler from './handlers/loadMoreSnaps'
import snapchatAccountOutOfDateHandler from './handlers/snapchatAccountOutOfDateHandler'

const service = createService()

service.configure(require('../package.json"))

service.initializeDatabase(db)

// service.handle( [topic name], [actions that may be published], [callback] )

service.handle(LOAD_MORE_SNAPS, [
  LOAD_MORE_SNAPS_RECEIVED,
  FINISHED_PARSING_LOAD_MORE_SNAPS,
  LOAD_MORE_SNAPS_AGAIN
], loadMoreSnapsHandler)

service.handle(SNAPCHAT_ACCOUNT_OUT_OF_DATE, [
  ALL_UPDATES_RECEIVED,
  FINISHED_PARSING_ALL_UPDATES
  GET_STORIES
  LOAD_MORE_SNAPS,
  SNAPCHAT_USER_FOUND_FROM_RECEIVED_SNAP
], snapchatAccountOutOfDateHandler)

service.listen()
```

## Folder Structure

Idea about how files and folders could be structured (roughly based on all
updates).

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

We should host all the SQS topics in a JSON file that is accessible online.

E.g: https://events.mish.guru

- This JSON file is generated using code
  - It is version controlled with git 
  - It is built on CircleCI and uploaded to an S3 bucket
- We should be able to validate the schema against previous events in a given
  time range
   - This allows us to check that any changes to the schema will not cause
     any unexpected validation errors

**Using constants with async events**

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
import { GEET_STORIES } from '@mishguru/events'

console.log(GEET_STORIES) // { name: 'GEET_STORIES', status: 'PENDING' }
```
