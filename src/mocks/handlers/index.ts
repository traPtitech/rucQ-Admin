import { campsHandlers } from './camps'
import { eventsHandlers } from './events'
import { usersHandlers } from './users'
import { questionsHandlers } from './questions'
import { paymentsHandlers } from './payments'
import { roomsHandlers } from './rooms'
import { imagesHandlers } from './images'
import { rollCallsHandlers } from './rollCalls'

export const handlers = [
  ...campsHandlers,
  ...eventsHandlers,
  ...usersHandlers,
  ...questionsHandlers,
  ...paymentsHandlers,
  ...roomsHandlers,
  ...imagesHandlers,
  ...rollCallsHandlers,
]
