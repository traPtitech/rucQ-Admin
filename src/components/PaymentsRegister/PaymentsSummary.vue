<script setup lang="ts">
import { computed } from 'vue'
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
const registeredUsers = computed(() => {
  return props.participants.filter((participant) =>
    props.payments.some((payment) => payment.userId === participant.id),
  )
})
const unregisteredUsers = computed(() => {
  return props.participants.filter(
    (participant) => !props.payments.some((payment) => payment.userId === participant.id),
  )
})
const canceledUsers = computed(() => {
  return props.payments.filter(
    (payment) => !props.participants.some((participant) => participant.id === payment.userId),
  )
})
</script>

<template>
  <section-card>
    <div class="mb-2">
      <div class="text-body-2">合計金額</div>
      <div class="text-h4">¥ {{ totalAmount.toLocaleString() }}</div>
    </div>
    <div class="d-flex ga-4">
      <div class="w-33">
        <div class="text-body-2">登録済み</div>
        <div class="text-h5">{{ registeredUsers.length }}</div>
      </div>
      <div class="w-33">
        <div class="text-body-2">未登録</div>
        <div class="text-h5">{{ unregisteredUsers.length }}</div>
      </div>
      <div class="w-33">
        <div class="text-body-2">キャンセル</div>
        <div class="text-h5">{{ canceledUsers.length }}</div>
      </div>
    </div>
  </section-card>
</template>
