import delay from 'delay'
import createService from '@zwolf/turbine'
import createDriver, {
  SubscriptionDeliveryType,
  GoogleCloudPubSubService,
} from '@zwolf/turbine-driver-google-cloud-pubsub'

const service = createService<GoogleCloudPubSubService>({
  serviceName: 'turbine-example',
  driver: createDriver({
    deliveryType: SubscriptionDeliveryType.PULL,
  }),
})

service.handle('ping', async (message, dispatch) => {
  console.log('Received PING', message)

  await delay(1000 * 1)

  console.log('Sending PONG')

  await dispatch({
    type: 'pong',
    payload: { pong: true },
  })
})

service.handle('pong', async (message, dispatch) => {
  console.log('Received PONG', message)

  await delay(1000 * 1)

  console.log('Sending PING')

  await dispatch({
    type: 'ping',
    payload: { ping: true },
  })
})

async function start () {
  const { router } = await service.start()

  router.get('/greet', (req, res) => {
    res.send('hello world!')
  })

  console.log('Kicking things off with a ping')

  await service.dispatch({
    type: 'ping',
    payload: {},
  })
}

start()
