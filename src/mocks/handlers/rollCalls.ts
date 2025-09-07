import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type RollCall = components['schemas']['RollCallResponse']
type RollCallRequest = components['schemas']['RollCallRequest']
type Reaction = components['schemas']['RollCallReactionResponse']
const rollCalls: RollCall[] = [
  {
    id: 1,
    name: '出発時バス点呼',
    description: 'キャンパス出発時の点呼です',
    options: ['1号車', '2号車', '3号車'],
    subjects: ['traP', 'trap1', 'trap2'],
  },
]
const reactions: Reaction[] = [
  { id: 1, userId: 'traP', content: '1号車' },
  { id: 2, userId: 'trap1', content: '2号車' },
  { id: 3, userId: 'trap2', content: '2号車' },
]
let nextRollCallId = rollCalls.length + 1

export const rollCallsHandlers = [
  http.get('/api/camps/{campId}/roll-calls', () => {
    return HttpResponse.json(rollCalls)
  }),
  http.post('/api/admin/camps/{campId}/roll-calls', async ({ request }) => {
    const body = await request.json()
    const newRollCall: RollCall = {
      id: nextRollCallId++,
      ...body,
    }
    rollCalls.push(newRollCall)
    return HttpResponse.json(newRollCall, { status: 201 })
  }),
  http.get('/api/roll-calls/{rollCallId}/reactions', () => {
    return HttpResponse.json(reactions)
  }),
]
