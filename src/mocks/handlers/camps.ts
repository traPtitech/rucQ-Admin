import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const campsHandlers = [
  http.get('/api/camps', () => {
    return HttpResponse.json([
      {
        id: 0,
        displayId: 'camp24summer',
        name: '2024年度夏合宿',
        guidebook: '',
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
        guidebook: '',
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
        guidebook: '',
        isDraft: true,
        isRegistrationOpen: false,
        isPaymentOpen: false,
        dateStart: '2025-09-01',
        dateEnd: '2025-09-03',
      },
    ])
  }),
]
