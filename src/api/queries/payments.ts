import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import { queryKeys } from '@/api/query-keys'
import type { components } from '@/api/schema'
type Payment = components['schemas']['PaymentResponse']
type PaymentRequest = components['schemas']['PaymentRequest']

const fetchPayments = async (campId: number): Promise<Payment[]> => {
  const { data, error } = await apiClient.GET('/api/admin/camps/{campId}/payments', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const createPayment = async (variables: {
  campId: number
  newPayment: PaymentRequest
}): Promise<Payment> => {
  const { campId, newPayment } = variables
  const { data, error } = await apiClient.POST('/api/admin/camps/{campId}/payments', {
    params: { path: { campId } },
    body: newPayment,
  })
  if (error) throw error
  return data
}

const updatePayment = async (variables: {
  paymentId: number
  updatedPayment: PaymentRequest
}): Promise<Payment> => {
  const { paymentId, updatedPayment } = variables
  const { data, error } = await apiClient.PUT('/api/admin/payments/{paymentId}', {
    params: { path: { paymentId } },
    body: updatedPayment,
  })
  if (error) throw error
  return data
}

export const usePaymentsQuery = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useQuery({
    queryKey: queryKeys.payments.all(campId.value),
    queryFn: () => fetchPayments(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      queryClient.setQueryData<Payment[]>(queryKeys.payments.all(data.campId), (old) =>
        old ? [...old, data] : [data],
      )
    },
  })
}

export const useUpdatePaymentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePayment,
    onSuccess: (data) => {
      queryClient.setQueryData<Payment[]>(queryKeys.payments.all(data.campId), (old) =>
        old?.map((payment) => (payment.id === data.id ? data : payment)),
      )
    },
  })
}