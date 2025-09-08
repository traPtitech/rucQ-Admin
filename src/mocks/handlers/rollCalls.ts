import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type RollCall = components['schemas']['RollCallResponse']
type RollCallReaction = components['schemas']['RollCallReactionResponse']

const rollCalls: RollCall[] = [
  {
    id: 0,
    name: '今どこにいますか',
    description: '現在地を教えてください',
    options: ['宿', 'バス', 'スキー場'],
    subjects: ['traP', 'trap2', 'trap3', 'trap4', 'trap5'],
  },
  {
    id: 1,
    name: 'バス乗車確認',
    description: 'バスに乗ったらリアクションしてください',
    options: ['1号車', '2号車'],
    subjects: ['traP', 'trap2', 'trap3'],
  },
]

const reactions: RollCallReaction[] = [
  {
    id: 0,
    userId: 'traP',
    content: '宿',
  },
  {
    id: 0,
    userId: 'trap2',
    content: '宿',
  },
  {
    id: 0,
    userId: 'trap3',
    content: '宿',
  },
  {
    id: 0,
    userId: 'trap4',
    content: '宿',
  },
  {
    id: 0,
    userId: 'trap5',
    content: 'バス',
  },
  {
    id: 1,
    userId: 'trap2',
    content: '1号車',
  },
]

let nextRollCallId = 2

export const rollCallsHandlers = [
  http.get('/api/camps/{campId}/roll-calls', () => {
    return HttpResponse.json(rollCalls, { status: 200 })
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

  http.get('/api/roll-calls/{rollCallId}/reactions', ({ params }) => {
    const rollCallId = Number(params.rollCallId)
    const rollCall = rollCalls.find((rc) => rc.id === rollCallId)
    if (!rollCall) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const rollCallReactions = reactions.filter((reaction) => reaction.id === rollCallId)
    return HttpResponse.json(rollCallReactions, { status: 200 })
  }),

  http.post('/api/roll-calls/{rollCallId}/reactions', async ({ params, request }) => {
    const rollCallId = Number(params.rollCallId)
    const rollCall = rollCalls.find((rc) => rc.id === rollCallId)
    if (!rollCall) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    const newReaction: RollCallReaction = {
      id: rollCallId,
      userId: 'traP',
      ...body,
    }
    reactions.push(newReaction)
    return HttpResponse.json(newReaction, { status: 201 })
  }),

  http.put('/api/reactions/{reactionId}', async ({ params, request }) => {
    const reactionId = Number(params.reactionId)
    const reactionIndex = reactions.findIndex((r) => r.id === reactionId)
    if (reactionIndex === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    reactions[reactionIndex] = {
      ...reactions[reactionIndex],
      ...body,
    }
    return HttpResponse.json(reactions[reactionIndex], { status: 200 })
  }),

  http.delete('/api/reactions/{reactionId}', ({ params }) => {
    const reactionId = Number(params.reactionId)
    const index = reactions.findIndex((r) => r.id === reactionId)
    if (index === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    reactions.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
