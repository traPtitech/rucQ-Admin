<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import BillingItemCard from '@/components/PaymentsRegister/BillingItemCard.vue'
import type { BillingItem } from '@/components/PaymentsRegister/billing-item'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{
  participants: User[]
  payments: Payment[]
}>()

const emit = defineEmits<{
  (e: 'submit', items: BillingItem[]): void
}>()

const nextId = ref(0)
const isModalOpen = ref(false)
const isFormValid = ref(false)
const billingItems = ref<BillingItem[]>([])
const totalAmount = computed(() => {
  return billingItems.value.reduce((sum, item) => {
    const totalUsers = new Set(item.targets.filter((user) => user)).size
    return sum + (item.amount ?? 0) * totalUsers
  }, 0)
})
const targetUsers = computed(() => {
  return [
    ...new Set([
      ...props.participants.map((user) => user.id),
      ...props.payments.map((payment) => payment.userId),
    ]),
  ]
})

const addItem = () => {
  billingItems.value.push({ id: nextId.value++, targets: [], amount: null })
}

const handleSubmit = () => {
  emit('submit', billingItems.value)
  billingItems.value = []
  isModalOpen.value = false
}
</script>

<template>
  <section-card>
    <v-form v-model="isFormValid">
      <div class="mb-4">
        <billing-item-card
          v-for="(item, index) in billingItems"
          :key="item.id"
          v-model="billingItems[index]"
          :target-users="targetUsers"
          @delete="billingItems.splice(index, 1)"
        />
      </div>
      <div class="d-flex justify-center">
        <v-btn
          class="flex-grow-1"
          prepend-icon="mdi-plus"
          color="secondary"
          variant="outlined"
          max-width="300"
          @click="addItem"
        >
          追加
        </v-btn>
      </div>
      <v-divider class="my-4" />
      <div class="d-flex align-end ga-2">
        <div>
          <div class="text-body-2">登録金額</div>
          <div class="text-h5">¥ {{ totalAmount.toLocaleString() }}</div>
        </div>
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          :disabled="!isFormValid"
          @click="isModalOpen = true"
        >
          登録
        </v-btn>
      </div>
    </v-form>
  </section-card>
  <v-dialog v-model="isModalOpen" max-width="400">
    <v-card title="合宿費の登録">
      <v-card-text>
        合計{{ totalAmount.toLocaleString() }}円の合宿費を新規に登録します。<br />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isModalOpen = false">キャンセル</v-btn>
        <v-btn color="primary" @click="handleSubmit">登録</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
