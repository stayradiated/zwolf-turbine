# turbine

> Thinking about how we can improve fanout-helpers

```
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
  - snapchatAccountOutOfDateHandler/
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
