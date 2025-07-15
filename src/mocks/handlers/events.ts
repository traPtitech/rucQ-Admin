import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import { getYear } from 'date-fns'
import type { components } from '@/api/schema'

type Event = components['schemas']['EventResponse']

const nextYearString = (getYear(new Date()) + 1).toString()

const markdownSample: string = `\
# ${nextYearString}年度冬合宿 体力テスト

## 概要
1/1-1/3 大岡山

## スケジュール

### 1日目
| 時間 | | 場所 |
| ----: | - | ---- |
| 9:00 | 集合 | 大岡山駅 |
| 9:15 | 開会式 | 部室 |
| 9:45 | 握力 | 体育館 |

### 2日目
| 時間 | | 場所 |
| ----: | - | ---- |
| 10:30 | 上体起こし | 体育館 |
| 11:15 | 長座体前屈 | 体育館 |

### 3日目
| 時間 | | 場所 |
| ----: | - | ---- |
| 10:00 | 持久走 | 陸上競技場 |
| 10:00 | 20mシャトルラン | 体育館 |
| 11:00 | 反復横跳び | 体育館 |
`

const events: Event[] = [
  {
    id: 0,
    type: 'moment',
    name: '集合',
    description: '',
    location: '大岡山駅',
    time: `${nextYearString}-02-01T09:00:00+09:00`,
  },
  {
    id: 1,
    type: 'official',
    name: '開会式',
    description: markdownSample,
    location: '部室',
    timeStart: `${nextYearString}-02-01T09:15:00+09:00`,
    timeEnd: `${nextYearString}-02-01T09:30:00+09:00`,
  },
  {
    id: 2,
    type: 'duration',
    name: '握力測定',
    description: '',
    location: '体育館',
    timeStart: `${nextYearString}-02-01T09:45:00+09:00`,
    timeEnd: `${nextYearString}-02-01T10:00:00+09:00`,
    organizerId: 'trap1',
    displayColor: 'orange',
  },
  {
    id: 3,
    type: 'duration',
    name: '上体起こし',
    description: '',
    location: '体育館',
    timeStart: `${nextYearString}-02-02T10:30:00+09:00`,
    timeEnd: `${nextYearString}-02-02T11:00:00+09:00`,
    organizerId: 'trap1',
    displayColor: 'green',
  },
  {
    id: 4,
    type: 'duration',
    name: '長座体前屈',
    description: '',
    location: '体育館',
    timeStart: `${nextYearString}-02-02T11:15:00+09:00`,
    timeEnd: `${nextYearString}-02-02T11:45:00+09:00`,
    organizerId: 'trap1',
    displayColor: 'red',
  },
  {
    id: 5,
    type: 'duration',
    name: '持久走',
    description: '',
    location: '陸上競技場',
    timeStart: `${nextYearString}-02-03T10:00:00+09:00`,
    timeEnd: `${nextYearString}-02-03T11:00:00+09:00`,
    organizerId: 'trap2',
    displayColor: 'blue',
  },
  {
    id: 6,
    type: 'duration',
    name: '20mシャトルラン',
    description: '',
    location: '体育館',
    timeStart: `${nextYearString}-02-03T10:00:00+09:00`,
    timeEnd: `${nextYearString}-02-03T11:00:00+09:00`,
    organizerId: 'trap3',
    displayColor: 'purple',
  },
  {
    id: 7,
    type: 'duration',
    name: '反復横跳び',
    description: '',
    location: '体育館',
    timeStart: `${nextYearString}-02-03T11:00:00+09:00`,
    timeEnd: `${nextYearString}-02-03T12:00:00+09:00`,
    organizerId: 'trap4',
    displayColor: 'pink',
  },
]

let nextEventId = 7

export const eventsHandlers = [
  http.get('/api/camps/{campId}/events', () => {
    return HttpResponse.json(events, { status: 200 })
  }),

  http.post('/api/camps/{campId}/events', async ({ request }) => {
    const body = await request.json()
    const newEvent = {
      id: nextEventId++,
      ...body,
    } as Event
    events.push(newEvent)
    return HttpResponse.json(newEvent, { status: 201 })
  }),

  http.put('/api/events/{eventId}', async ({ params, request }) => {
    const eventId = Number(params.eventId)
    const event = events.find((e) => e.id === eventId)
    if (!event) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    const body = await request.json()
    Object.assign(event, body)
    return HttpResponse.json(event)
  }),

  http.delete('/api/events/{eventId}', ({ params }) => {
    const eventId = Number(params.eventId)
    const index = events.findIndex((e) => e.id === eventId)
    if (index === -1) {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    }
    events.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
