import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const campsHandlers = [
  http.get('/api/camps', () => {
    return HttpResponse.json([
      {
        id: 0,
        displayId: 'camp24summer',
        name: '2024年度夏合宿',
        description: '山中湖 三盛荘',
        isDraft: false,
        isRegistrationOpen: false,
        isPaymentOpen: true,
      },
      {
        id: 1,
        displayId: 'camp25spring',
        name: '2024年度春合宿',
        description: '草津 ホテルヴィレッジ',
        isDraft: false,
        isRegistrationOpen: true,
        isPaymentOpen: false,
      },
      {
        id: 2,
        displayId: 'camp25summer',
        name: '2025年度夏合宿',
        description: '越後湯沢 でんき屋',
        isDraft: true,
        isRegistrationOpen: false,
        isPaymentOpen: false,
      },
    ])
  }),
]
