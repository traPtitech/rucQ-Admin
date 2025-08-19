<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import PaymentsSummary from '@/components/PaymentsRegister/PaymentsSummary.vue'
import PaymentsEditor from '@/components/PaymentsRegister/PaymentsEditor.vue'
import { aggregateBillingItems, type BillingItem } from '@/components/PaymentsRegister/billing-item'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']
type PaymentRequest = components['schemas']['PaymentRequest']

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const participants = ref<User[]>([])
const payments = ref<Payment[]>([])

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}

const fetchParticipants = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

const fetchPayments = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/admin/camps/{campId}/payments', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

const createPayment = async (payment: PaymentRequest) => {
  if (!camp.value) return
  const { error } = await apiClient.POST('/api/admin/camps/{campId}/payments', {
    params: { path: { campId: camp.value.id } },
    body: payment,
  })
  if (error) {
    alert(`@${payment.userId}の支払い情報の登録に失敗しました: ${error.message}`)
    return
  }
}

const updatePayment = async (id: number, payment: PaymentRequest) => {
  if (!camp.value) return
  const { error } = await apiClient.PUT('/api/admin/payments/{paymentId}', {
    params: { path: { paymentId: id } },
    body: payment,
  })
  if (error) {
    alert(`@${payment.userId}の支払い情報の更新に失敗しました: ${error.message}`)
    return
  }
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = (await fetchParticipants()) ?? []
  payments.value = (await fetchPayments()) ?? []
})

const handleSubmit = async (billingItems: BillingItem[]) => {
  if (!camp.value) return
  const aggregatedItems = aggregateBillingItems(billingItems)
  for (const item of aggregatedItems) {
    const payment = payments.value.find((p) => p.userId === item.userId)
    const paymentRequest: PaymentRequest = {
      userId: item.userId,
      campId: camp.value.id,
      amount: item.amount + (payment?.amount ?? 0),
      amountPaid: payment?.amountPaid ?? 0,
    }
    if (payment) await updatePayment(payment.id, paymentRequest)
    else await createPayment(paymentRequest)
  }
  payments.value = (await fetchPayments()) ?? []
}
</script>

<template>
  <v-container max-width="800">
    <section-title title="概要" />
    <payments-summary :participants="participants" :payments="payments" />
    <section-title title="登録" />
    <payments-editor :participants="participants" :payments="payments" @submit="handleSubmit" />
  </v-container>
</template>
