<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserSelector from '@/components/PaymentsRegister/UserSelector.vue'
import PaymentStatus from '@/components/PaymentsRegister/PaymentStatus.vue'
import PaymentRegisterForm from '@/components/PaymentsRegister/PaymentRegisterForm.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import type { VAutocomplete } from 'vuetify/components'
type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']
type PaymentRequest = components['schemas']['PaymentRequest']

const autocompleteRef = ref<VAutocomplete | null>(null)
const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const participants = ref<User[]>([])
const payments = ref<Payment[]>([])

const selectedId = ref<string | null>(null)
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

const registerPayment = async (payment: PaymentRequest) => {
  if (!camp.value) return
  const { data, error } = await apiClient.POST('/api/admin/camps/{campId}/payments', {
    params: { path: { campId: camp.value.id } },
    body: payment,
  })
  if (data) {
    payments.value.push(data)
  }
  if (error) {
    alert('支払い情報の登録に失敗しました')
  }
}

const updatePayment = async (paymentId: number, payment: PaymentRequest) => {
  if (!camp.value) return
  const { data, error } = await apiClient.PUT('/api/admin/payments/{paymentId}', {
    params: { path: { paymentId } },
    body: payment,
  })
  if (data) {
    const index = payments.value.findIndex((p) => p.id === paymentId)
    if (index !== -1) {
      payments.value[index] = data
    }
  }
  if (error) {
    alert('支払い情報の更新に失敗しました')
  }
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = (await fetchParticipants()) ?? []
  payments.value = (await fetchPayments()) ?? []
})
</script>

<template>
  <v-container max-width="800">
    <user-selector
      :users="participants"
      v-model:autocomplete-ref="autocompleteRef"
      v-model:selected-id="selectedId"
    />
    <section-card>
      <payment-status :data="selectedData" />
      <payment-register-form
        :data="selectedData"
        @register="registerPayment"
        @update="updatePayment"
      />
    </section-card>
  </v-container>
</template>
