<script setup lang="ts">
import { computed } from 'vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import type { BillingItem } from '@/components/PaymentsRegister/billing-item'

const billingItem = defineModel<BillingItem>({ required: true })

const props = defineProps<{
  targetUsers: string[]
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const totalUsers = computed(() => {
  return new Set(billingItem.value.targets.filter((user) => user)).size
})
const totalAmount = computed(() => {
  return (billingItem.value.amount ?? 0) * totalUsers.value
})
const targetsModel = computed({
  get: () => billingItem.value.targets.map((user) => (user ? `@${user}` : '')).join(' '),
  set: (value) => {
    billingItem.value.targets = value.split(' ').map((user) => user.replace(/^@/, ''))
  },
})
const targetsInnerIcon = computed(() => {
  if (totalUsers.value > 0) return 'mdi-close'
  return undefined
})
const isTargetUser = computed(() => {
  return billingItem.value.targets.every((target) => props.targetUsers.includes(target) || !target)
})

const targetUserRule = () => isTargetUser.value || '不明なユーザーです'
const requiredRule = () => totalUsers.value > 0 || '対象ユーザーを選択してください'

const handleAppendInnerClick = () => {
  if (totalUsers.value > 0) {
    billingItem.value.targets = []
  }
}
</script>

<template>
  <content-card>
    <div class="d-flex ga-2">
      <div class="w-100">
        <div class="text-body-2">対象</div>
        <v-text-field
          v-model="targetsModel"
          :rules="[targetUserRule, requiredRule]"
          :append-inner-icon="targetsInnerIcon"
          variant="outlined"
          @click:append-inner="handleAppendInnerClick"
        />
      </div>
      <v-btn
        class="ma-2"
        icon="mdi-delete"
        size="medium"
        variant="plain"
        @click="emit('delete', billingItem.id)"
      />
    </div>
    <div class="d-flex ga-4">
      <div class="w-33">
        <div class="text-body-2">人数</div>
        <div class="text-h5">{{ totalUsers }}</div>
      </div>
      <div class="w-33">
        <div class="text-body-2">費用</div>
        <v-number-input
          v-model="billingItem.amount"
          class="amount-input"
          :rules="[(v) => !!v]"
          variant="underlined"
          control-variant="hidden"
          density="compact"
          hide-details
        />
      </div>
      <div class="w-33">
        <div class="text-body-2">合計</div>
        <div class="text-h5 font-weight-bold">¥ {{ totalAmount.toLocaleString() }}</div>
      </div>
    </div>
  </content-card>
</template>

<style scoped>
.amount-input :deep(.v-field__input) {
  padding: 0;
  /* text-h5 */
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.333;
  line-height: normal;
}
</style>
