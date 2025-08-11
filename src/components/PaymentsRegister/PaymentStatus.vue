<script setup lang="ts">
import { computed } from 'vue'
import type { components } from '@/api/schema'
type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{
  data?: Payment
}>()

const status = computed(() => {
  if (props.data === undefined) return 'unregistered'
  if (props.data.amount === props.data.amountPaid) return 'paid'
  if (props.data.amountPaid === 0) return 'pending'
  return 'error'
})
</script>

<template>
  <div class="text-center rounded pa-4 mb-6" :class="$style[status]">
    <template v-if="status === 'unregistered'">
      <div class="text-h5 font-weight-bold">未登録</div>
      <div class="text-subtitle-1">合宿費情報が登録されていません</div>
    </template>
    <template v-if="status === 'pending'">
      <div class="text-h5 font-weight-bold">¥{{ data?.amount.toLocaleString() }}</div>
      <div class="text-subtitle-1">支払いが完了していません</div>
    </template>
    <template v-if="status === 'paid'">
      <div class="text-h5 font-weight-bold">¥{{ data?.amount.toLocaleString() }}</div>
      <div class="text-subtitle-1">支払いが完了しています</div>
    </template>
    <template v-if="status === 'error'">
      <div class="text-h5 font-weight-bold">¥{{ data?.amount.toLocaleString() }}</div>
      <div class="text-subtitle-1">
        現在の支払い金額は ¥{{ data?.amountPaid.toLocaleString() }} です
      </div>
    </template>
  </div>
</template>

<style module>
.unregistered {
  background-color: rgba(128, 128, 128, 0.1);
  color: rgb(128, 128, 128);
}

.pending {
  background-color: rgba(var(--v-theme-warning), 0.1);
  color: rgb(var(--v-theme-warning));
}

.paid {
  background-color: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
}

.error {
  background-color: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}
</style>
