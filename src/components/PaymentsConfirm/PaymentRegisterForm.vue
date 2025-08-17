<script setup lang="ts">
import { computed } from 'vue'
import type { VBtn } from 'vuetify/components'
import type { components } from '@/api/schema'
type Payment = components['schemas']['PaymentResponse']
type PaymentRequest = components['schemas']['PaymentRequest']

const confirmButtonRef = defineModel<VBtn | null>('confirmButtonRef', { default: null })
const newAmountPaid = defineModel<number | null>('newAmountPaid', { default: null })

const props = defineProps<{
  data?: Payment
}>()

const emit = defineEmits<{
  (e: 'update', paymentId: number, payment: PaymentRequest): void
}>()

const buttonColor = computed(() => {
  if (!props.data) return 'secondary'
  if (newAmountPaid.value === null || newAmountPaid.value === 0) return 'secondary'
  if (newAmountPaid.value + props.data.amountPaid === props.data.amount) return 'success'
  return 'error'
})

const handleUpdate = () => {
  if (!props.data) return
  if (newAmountPaid.value === null || newAmountPaid.value === 0) return
  const payment: PaymentRequest = {
    ...props.data,
    amountPaid: props.data.amountPaid + newAmountPaid.value,
  }
  emit('update', props.data.id, payment)
}
</script>

<template>
  <div>
    <v-number-input
      v-model="newAmountPaid"
      class="payment-input mb-2"
      label="振込金額"
      hint="新しく振り込まれた金額 返金ならマイナス"
      :disabled="!props.data"
      control-variant="hidden"
      variant="outlined"
    />
    <div class="d-flex justify-center">
      <v-btn
        ref="confirmButtonRef"
        :color="buttonColor"
        :disabled="(newAmountPaid ?? 0) === 0"
        width="100%"
        max-width="400"
        @click="handleUpdate"
      >
        {{ (newAmountPaid ?? 0) >= 0 ? '振込確認' : '返金確認' }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.payment-input :deep(.v-field__input) {
  font-size: 1.25rem;
}
</style>
