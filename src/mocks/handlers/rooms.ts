import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type RoomGroup = components['schemas']['RoomGroupResponse']
type Room = components['schemas']['RoomResponse']

const roomGroups: RoomGroup[] = [
  {
    id: 0,
    name: '1F',
    rooms: [
      {
        id: 0,
        name: '101',
        members: [
          { id: 'traP', isStaff: true },
          { id: 'trap2', isStaff: true },
          { id: 'trap3', isStaff: false },
          { id: 'trap4', isStaff: false },
          { id: 'trap5', isStaff: false },
          { id: 'trap6', isStaff: false },
          { id: 'trap7', isStaff: false },
          { id: 'trap8', isStaff: false },
        ],
      },
      {
        id: 1,
        name: '102',
        members: [],
      },
    ],
  },
  {
    id: 1,
    name: '2F',
    rooms: [
      {
        id: 2,
        name: '201',
        members: [],
      },
    ],
  },
]

let nextRoomGroupId = 2
let nextRoomId = 3

export const roomsHandlers = [
  http.get('/api/camps/{campId}/room-groups', () => {
    return HttpResponse.json(roomGroups, { status: 200 })
  }),

  http.post('/api/admin/camps/{campId}/room-groups', async ({ request }) => {
    const body = await request.json()
    const newRoomGroup: RoomGroup = {
      id: nextRoomGroupId++,
      rooms: [],
      ...body,
    }
    roomGroups.push(newRoomGroup)
    return HttpResponse.json(newRoomGroup, { status: 201 })
  }),

  http.put('/api/admin/room-groups/{roomGroupId}', async ({ params, request }) => {
    const roomGroupId = Number(params.roomGroupId)
    const roomGroup = roomGroups.find((rg) => rg.id === roomGroupId)
    if (!roomGroup) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    Object.assign(roomGroup, body)
    return HttpResponse.json(roomGroup)
  }),

  http.delete('/api/admin/room-groups/{roomGroupId}', ({ params }) => {
    const roomGroupId = Number(params.roomGroupId)
    const index = roomGroups.findIndex((rg) => rg.id === roomGroupId)
    if (index === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    roomGroups.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/admin/rooms', async ({ request }) => {
    const body = await request.json()
    const roomGroupId = body.roomGroupId
    const roomGroup = roomGroups.find((rg) => rg.id === roomGroupId)
    if (!roomGroup) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const newRoom: Room = {
      id: nextRoomId++,
      name: body.name,
      members: body.memberIds.map((id: string) => ({ id, isStaff: false })),
    }
    roomGroup.rooms.push(newRoom)
    return HttpResponse.json(newRoom, { status: 201 })
  }),

  http.put('/api/admin/rooms/{roomId}', async ({ params, request }) => {
    const roomId = Number(params.roomId)
    const roomGroup = roomGroups.find((rg) => rg.rooms.some((r) => r.id === roomId))
    if (!roomGroup) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const room = roomGroup.rooms.find((r) => r.id === roomId)
    if (!room) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    const updatedRoom = {
      name: body.name,
      members: body.memberIds.map((id: string) => ({ id, isStaff: false })),
    }
    Object.assign(room, updatedRoom)
    return HttpResponse.json(room)
  }),

  http.delete('/api/admin/rooms/{roomId}', ({ params }) => {
    const roomId = Number(params.roomId)
    const roomGroup = roomGroups.find((rg) => rg.rooms.some((r) => r.id === roomId))
    if (!roomGroup) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const roomIndex = roomGroup.rooms.findIndex((r) => r.id === roomId)
    if (roomIndex === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    roomGroup.rooms.splice(roomIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
