<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PaymentsSummary from '@/components/Payments/PaymentsSummary.vue'
import PaymentsInformation from '@/components/Payments/PaymentsInformation.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const participants = ref<User[]>([])
const payments = ref<Payment[]>([])

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}

const fetchParticipants = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

const fetchPayments = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/admin/camps/{campId}/payments', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = (await fetchParticipants()) ?? []
  payments.value = (await fetchPayments()) ?? []
})
</script>

<template>
  <v-container max-width="800">
    <payments-summary :participants="participants" :payments="payments" />
    <payments-information :participants="participants" :payments="payments" />
  </v-container>
</template>
