import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type Payment = components['schemas']['PaymentResponse']

const payments: Payment[] = [
  {
    id: 0,
    userId: 'traP',
    campId: 2,
    amount: 29800,
    amountPaid: 29800,
  },
  {
    id: 1,
    userId: 'trap2',
    campId: 2,
    amount: 29800,
    amountPaid: 0,
  },
  {
    id: 2,
    userId: 'trap4',
    campId: 2,
    amount: 35000,
    amountPaid: 10000,
  },
]

let nextPaymentId = payments.length

export const paymentsHandlers = [
  http.get('/api/admin/camps/{campId}/payments', ({ params }) => {
    const campId = Number.parseInt(params.campId as string, 10)
    return HttpResponse.json(
      payments.filter((payment) => payment.campId === campId),
      { status: 200 },
    )
  }),

  http.post('/api/admin/camps/{campId}/payments', async ({ request }) => {
    const body = await request.json()
    const newPayment = {
      id: nextPaymentId++,
      ...body,
    }
    payments.push(newPayment)
    return HttpResponse.json(newPayment, { status: 201 })
  }),

  http.put('/api/admin/payments/{paymentId}', async ({ params, request }) => {
    const paymentId = Number.parseInt(params.paymentId as string, 10)
    const paymentIndex = payments.findIndex((payment) => payment.id === paymentId)
    if (paymentIndex === -1) {
      return HttpResponse.json({ message: 'Payment not found' }, { status: 404 })
    }
    const body = await request.json()
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      ...body,
    }
    return HttpResponse.json(payments[paymentIndex], { status: 200 })
  }),
]
