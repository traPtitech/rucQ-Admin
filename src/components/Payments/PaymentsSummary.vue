<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{
  participants: User[]
  payments: Payment[]
}>()

const totalAmount = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amount, 0)
})
const totalAmountPaid = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amountPaid, 0)
})
const settledUsers = computed(() => {
  return props.payments
    .filter((payment) => payment.amount === payment.amountPaid)
    .map((payment) => payment.userId)
})
const unsettledUsers = computed(() => {
  return props.payments
    .filter((payment) => payment.amountPaid !== payment.amount)
    .map((payment) => payment.userId)
})
const unregisteredUsers = computed(() => {
  return props.participants
    .filter((participant) => !props.payments.some((payment) => payment.userId === participant.id))
    .map((participant) => participant.id)
})
</script>

<template>
  <section-title title="概要" />
  <section-card class="d-flex flex-column ga-2">
    <div class="d-flex ga-4">
      <div class="w-50">
        <div class="text-body-2">合宿費</div>
        <div class="text-h5">¥ {{ totalAmount.toLocaleString() }}</div>
      </div>
      <div class="w-50">
        <div class="text-body-2">現在の徴収額</div>
        <div class="text-h5">¥ {{ totalAmountPaid.toLocaleString() }}</div>
      </div>
    </div>
    <div class="d-flex ga-4">
      <div class="w-33">
        <div class="text-body-2">完了</div>
        <div class="text-h5">{{ settledUsers.length }}</div>
      </div>
      <div class="w-33">
        <div class="text-body-2">未精算</div>
        <div class="text-h5">{{ unsettledUsers.length }}</div>
      </div>
      <div class="w-33">
        <div class="text-body-2">未登録</div>
        <div class="text-h5">{{ unregisteredUsers.length }}</div>
      </div>
    </div>
  </section-card>
</template>
