import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type User = components['schemas']['UserResponse']

const users: User[] = [
  { id: 'traP', isStaff: true },
  { id: 'trap2', isStaff: true },
  { id: 'trap3', isStaff: false },
  { id: 'trap4', isStaff: false },
]

export const usersHandlers = [
  http.get('/api/me', () => {
    return HttpResponse.json({
      id: 'traP',
      isStaff: true,
    })
  }),

  http.get('/api/staffs', () => {
    return HttpResponse.json(users.filter((user) => user.isStaff))
  }),

  http.get('/api/admin/users/{userId}', ({ params }) => {
    const user = users.find((s) => s.id === params.userId)
    if (user === undefined) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  http.put('/api/admin/users/{userId}', async ({ params, request }) => {
    // 自分自身の情報は編集できない
    if (params.userId === 'traP') {
      return HttpResponse.json(
        { message: 'Editing self information is not allowed' },
        { status: 403 },
      )
    }

    const user = users.find((s) => s.id === params.userId)
    if (user === undefined) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }

    const body = await request.json()
    user.isStaff = body.isStaff
    return HttpResponse.json(user)
  }),
]
