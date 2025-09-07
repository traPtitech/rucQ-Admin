<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type RollCall = components['schemas']['RollCallResponse']
type RollCallReaction = components['schemas']['RollCallReactionResponse']

const route = useRoute()
const campname = route.params.campname as string
const rollCallId: number = Number(route.params.rollCallId)

let eventSource: EventSource | null = null
const camp = ref<Camp>()
const rollCall = ref<RollCall>()
const reactions = ref<RollCallReaction[]>()

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}

const fetchRollCall = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.value.id } },
  })
  return data?.find((rc) => rc.id === rollCallId)
}

const fetchReactions = async () => {
  const { data } = await apiClient.GET('/api/roll-calls/{rollCallId}/reactions', {
    params: { path: { rollCallId } },
  })
  return data
}

const setupReactionStream = () => {
  const url = `/api/roll-calls/${rollCallId}/reactions/stream`
  eventSource = new EventSource(url)

  eventSource.onmessage = (event) => {
    const newReaction = JSON.parse(event.data) as RollCallReaction
    if (reactions.value === undefined) return
    const index = reactions.value.findIndex((r) => r.userId === newReaction.userId)
    if (index !== -1) reactions.value[index] = newReaction
    else reactions.value.push(newReaction)
  }

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error)
    eventSource?.close()
  }
}

onMounted(async () => {
  camp.value = await fetchCamp()
  rollCall.value = await fetchRollCall()
  reactions.value = await fetchReactions()
  setupReactionStream()
})

onUnmounted(() => {
  eventSource?.close()
})
</script>

<template>
  <v-container> Roll Call </v-container>
</template>
