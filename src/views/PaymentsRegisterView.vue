<script setup lang="ts">
import SectionTitle from '@/components/shared/SectionTitle.vue'
import PaymentsSummary from '@/components/PaymentsRegister/PaymentsSummary.vue'
import PaymentsEditor from '@/components/PaymentsRegister/PaymentsEditor.vue'
import { aggregateBillingItems, type BillingItem } from '@/components/PaymentsRegister/billing-item'
import { useCurrentCampQuery } from '@/api/queries/camps'
import {
  usePaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
} from '@/api/queries/payments'
import { useParticipantsQuery } from '@/api/queries/participants'
import type { components } from '@/api/schema'
type PaymentRequest = components['schemas']['PaymentRequest']

const { data: camp } = useCurrentCampQuery()
const { data: payments } = usePaymentsQuery()
const { data: participants } = useParticipantsQuery()
const { mutate: createPayment } = useCreatePaymentMutation()
const { mutate: updatePayment } = useUpdatePaymentMutation()

const handleSubmit = async (billingItems: BillingItem[]) => {
  if (!camp.value) return
  const aggregatedItems = aggregateBillingItems(billingItems)
  for (const item of aggregatedItems) {
    const payment = payments.value?.find((p) => p.userId === item.userId)
    const paymentRequest: PaymentRequest = {
      userId: item.userId,
      campId: camp.value.id,
      amount: item.amount + (payment?.amount ?? 0),
      amountPaid: payment?.amountPaid ?? 0,
    }
    if (payment) updatePayment({ paymentId: payment.id, updatedPayment: paymentRequest })
    else createPayment({ campId: camp.value.id, newPayment: paymentRequest })
  }
}
</script>

<template>
  <v-container v-if="payments !== undefined && participants !== undefined" max-width="800">
    <section-title title="概要" />
    <payments-summary :participants="participants" :payments="payments" />
    <section-title title="登録" />
    <payments-editor :participants="participants" :payments="payments" @submit="handleSubmit" />
  </v-container>
</template>
