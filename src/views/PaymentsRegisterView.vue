<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserSelector from '@/components/PaymentsRegister/UserSelector.vue'
import PaymentStatus from '@/components/PaymentsRegister/PaymentStatus.vue'
import PaymentRegisterForm from '@/components/PaymentsRegister/PaymentRegisterForm.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import type { VAutocomplete, VBtn } from 'vuetify/components'
type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']
type PaymentRequest = components['schemas']['PaymentRequest']

const autocompleteRef = ref<VAutocomplete | null>(null)
const confirmButtonRef = ref<VBtn | null>(null)
const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const participants = ref<User[]>([])
const payments = ref<Payment[]>([])

const selectedId = ref<string | null>(null)
const newAmountPaid = ref<number | null>(null)
const selectedData = computed(() => {
  if (!selectedId.value || !camp.value) return undefined
  return payments.value.find((p) => p.userId === selectedId.value)
})

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}

const fetchPayments = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/admin/camps/{campId}/payments', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

const fetchParticipants = async () => {
  if (!camp.value) return []
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
  })
  return data ?? []
}

const updatePayment = async (paymentId: number, payment: PaymentRequest) => {
  if (!camp.value) return
  const { data, error } = await apiClient.PUT('/api/admin/payments/{paymentId}', {
    params: { path: { paymentId } },
    body: payment,
  })
  if (error) {
    alert('支払い情報の更新に失敗しました')
    return
  }
  const index = payments.value.findIndex((p) => p.id === paymentId)
  if (index !== -1) {
    payments.value[index] = data
  }
  selectedId.value = null
  autocompleteRef.value?.focus()
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = (await fetchParticipants()) ?? []
  payments.value = (await fetchPayments()) ?? []
})

const focusConfirmButton = async () => {
  if (selectedData.value?.amountPaid === 0) {
    newAmountPaid.value = selectedData.value.amount
    await nextTick()
    confirmButtonRef.value?.$el.focus()
  }
}
</script>

<template>
  <v-container max-width="800">
    <user-selector
      v-model:autocomplete-ref="autocompleteRef"
      v-model:selected-id="selectedId"
      :users="participants"
      @tab-pressed="focusConfirmButton"
    />
    <section-card v-if="selectedId" class="mt-4">
      <payment-status :data="selectedData" />
      <payment-register-form
        v-model:confirm-button-ref="confirmButtonRef"
        v-model:new-amount-paid="newAmountPaid"
        :data="selectedData"
        @update="updatePayment"
      />
    </section-card>
    <div v-else class="text-h5 text-medium-emphasis text-center mt-8">ユーザー未選択</div>
  </v-container>
</template>
