import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']

const guidebook = (name: string): string => {
  return `\
# ${name}

## 概要
1/1-1/3 大岡山

## スケジュール

### 1日目
| 時間 | | 場所 |
| ----: | - | ---- |
| 9:00 | 集合 | 大岡山駅 |
| 11:00 | 開会式 | 会場 |
| 12:00 | 昼食 | 会場 |


## リンク集
- [東京工業大学](https://www.titech.ac.jp)
- [東京科学大学](https://www.isct.ac.jp/ja)
`
}

const camps: Camp[] = [
  {
    id: 0,
    displayId: 'camp24summer',
    name: '2024年度夏合宿',
    guidebook: guidebook('2024年度夏合宿'),
    isDraft: false,
    isRegistrationOpen: false,
    isPaymentOpen: true,
    dateStart: '2024-09-01',
    dateEnd: '2024-09-03',
  },
  {
    id: 1,
    displayId: 'camp25spring',
    name: '2024年度春合宿',
    guidebook: guidebook('2024年度春合宿'),
    isDraft: false,
    isRegistrationOpen: true,
    isPaymentOpen: false,
    dateStart: '2024-03-01',
    dateEnd: '2024-03-03',
  },
  {
    id: 2,
    displayId: 'camp25summer',
    name: '2025年度夏合宿',
    guidebook: guidebook('2025年度夏合宿'),
    isDraft: true,
    isRegistrationOpen: false,
    isPaymentOpen: false,
    dateStart: '2025-09-01',
    dateEnd: '2025-09-03',
  },
]

const participants: User[] = [
  { id: 'traP', isStaff: true },
  { id: 'trap2', isStaff: true },
  { id: 'trap3', isStaff: false },
]

let nextCampId = 3

export const campsHandlers = [
  http.get('/api/camps', () => {
    return HttpResponse.json(camps, { status: 200 })
  }),

  http.post('/api/admin/camps', async ({ request }) => {
    const body = await request.json()
    const newCamp: Camp = {
      id: nextCampId++,
      ...body,
    }
    camps.push(newCamp)
    return HttpResponse.json(newCamp, { status: 201 })
  }),

  http.put('/api/admin/camps/{campId}', async ({ params, request }) => {
    const campId = Number.parseInt(params.campId)
    const camp = camps.find((c) => c.id === campId)
    if (camp === undefined) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    Object.assign(camp, body)
    return HttpResponse.json(camp)
  }),

  http.delete('/api/admin/camps/{campId}', ({ params }) => {
    const campId = Number(params.campId)
    const index = camps.findIndex((c) => c.id === campId)
    if (index === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    camps.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/camps/{campId}/participants', () => {
    return HttpResponse.json(participants, { status: 200 })
  }),
]
