<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CampSummaryCard from '@/components/CampTop/CampSummaryCard.vue'
import GuidebookCard from '@/components/CampTop/GuidebookCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<components['schemas']['CampResponse']>()

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}

onMounted(async () => {
  camp.value = await fetchCamp()
})

const handleUpdate = async (updatedCamp: components['schemas']['CampRequest']) => {
  if (!camp.value) return
  const { error } = await apiClient.PUT('/api/admin/camps/{campId}', {
    params: { path: { campId: camp.value.id } },
    body: updatedCamp,
  })
  if (error) return
  camp.value = { ...camp.value, ...updatedCamp }
}
</script>

<template>
  <v-container class="d-flex flex-column ga-4">
    <CampSummaryCard :camp="camp" @update="handleUpdate" />
    <GuidebookCard :camp="camp" />
  </v-container>
</template>
