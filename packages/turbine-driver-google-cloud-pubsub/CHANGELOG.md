# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.4.3](https://github.com/stayradiated/zwolf-turbine/compare/v3.4.2...v3.4.3) (2020-02-01)

**Note:** Version bump only for package @zwolf/turbine-driver-google-cloud-pubsub





## [3.4.2](https://github.com/stayradiated/zwolf-turbine/compare/v3.4.1...v3.4.2) (2020-02-01)

**Note:** Version bump only for package @zwolf/turbine-driver-google-cloud-pubsub





## [3.4.1](https://github.com/stayradiated/zwolf-turbine/compare/v3.4.0...v3.4.1) (2020-02-01)

**Note:** Version bump only for package @zwolf/turbine-driver-google-cloud-pubsub





# [3.4.0](https://github.com/stayradiated/zwolf-turbine/compare/v3.3.0...v3.4.0) (2020-01-30)


### Features

* **turbine-driver-google-cloud-pubsub:** add /refresh-subscriptions handler ([a4b53fc](https://github.com/stayradiated/zwolf-turbine/commit/a4b53fcce26a38d86de9ca4053f3ad93f5c19ce9))





# [3.3.0](https://github.com/stayradiated/zwolf-turbine/compare/v3.2.0...v3.3.0) (2020-01-29)


### Features

* **turbine-driver-google-cloud-pubsub:** start HTTP server as soon as possible ([ffc833c](https://github.com/stayradiated/zwolf-turbine/commit/ffc833cdb507418811efd65919464fba71e611f5))





# [3.2.0](https://github.com/stayradiated/zwolf-turbine/compare/v3.1.0...v3.2.0) (2020-01-28)


### Features

* **turbine-driver-google-cloud-pubsub:** use sub.setMetadata to change ackDeadlineSeconds ([3ef7e21](https://github.com/stayradiated/zwolf-turbine/commit/3ef7e21aaef5737518423fc4df9218205c014a25))





# [3.1.0](https://github.com/stayradiated/zwolf-turbine/compare/v3.0.0...v3.1.0) (2020-01-28)


### Features

* **turbine-driver-google-cloud-pubsub:** support modifying ackDeadlineSeconds ([93fcabb](https://github.com/stayradiated/zwolf-turbine/commit/93fcabb4c03bf35905ec82114f6376fa259992a6))





# [3.0.0](https://github.com/stayradiated/zwolf-turbine/compare/v2.2.0...v3.0.0) (2020-01-28)


### Features

* **turbine-driver-google-cloud-pubsub:** support ackDeadlineSeconds ([75a025a](https://github.com/stayradiated/zwolf-turbine/commit/75a025a21f3ea39648e39b503d827b5369a085f9))


### BREAKING CHANGES

* **turbine-driver-google-cloud-pubsub:** turbine has renamed `events` to `subscriptionHandlers`
and replaces the [type, handlerFn] tuple with the object {type, handlerFn}.





# [2.2.0](https://github.com/stayradiated/zwolf-turbine/compare/v2.1.0...v2.2.0) (2020-01-26)


### Features

* **turbine-driver-google-cloud-pubsub:** only modify subscription if needed ([eadb7a6](https://github.com/stayradiated/zwolf-turbine/commit/eadb7a64f94ca666cdbd605c61776f31c609396c))





# [2.1.0](https://github.com/stayradiated/zwolf-turbine/compare/v2.0.0...v2.1.0) (2020-01-26)


### Features

* **turbine-driver-google-cloud-pubsub:** work around for setting oidcToken ([02e9a17](https://github.com/stayradiated/zwolf-turbine/commit/02e9a17d2d8a90dfa9c0327942e0921d3b1ceda5))
