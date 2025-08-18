<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import PaymentsListMobile from '@/components/Payments/PaymentsListMobile.vue'
import PaymentsListDesktop from '@/components/Payments/PaymentsListDesktop.vue'
import type { PaymentData } from '@/components/Payments/payments-list'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{
  participants: User[]
  payments: Payment[]
}>()

const { mobile } = useDisplay()

const statusSortOrder: Record<PaymentData['status'], number> = {
  未登録: 0,
  一部未払い: 1,
  未払い: 2,
  要返金: 3,
  完了: 4,
}

const paymentsData = computed<PaymentData[]>(() => {
  const registeredData: PaymentData[] = props.payments.map((payment) => {
    const status = (() => {
      if (payment.amountPaid === payment.amount) return '完了'
      if (payment.amountPaid === 0) return '未払い'
      if (payment.amountPaid > payment.amount) return '要返金'
      else return '一部未払い'
    })()
    return {
      userId: payment.userId,
      amount: payment.amount,
      amountPaid: payment.amountPaid,
      status,
      statusValue: statusSortOrder[status],
      isParticipant: props.participants.some((p) => p.id === payment.userId),
    }
  })
  const unregisteredUsers: PaymentData[] = props.participants
    .filter((participant) => !props.payments.some((payment) => payment.userId === participant.id))
    .map((participant) => ({
      userId: participant.id,
      amount: undefined,
      amountPaid: undefined,
      status: '未登録',
      statusValue: statusSortOrder['未登録'],
      isParticipant: true,
    }))
  return registeredData.concat(unregisteredUsers)
})
</script>

<template>
  <section-title title="支払い情報" />
  <section-card>
    <payments-list-mobile v-if="mobile" :data="paymentsData" />
    <payments-list-desktop v-else :data="paymentsData" />
  </section-card>
</template>
