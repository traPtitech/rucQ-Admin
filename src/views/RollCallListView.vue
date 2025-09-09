<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

import CreateRollCallButton from '@/components/RollCallList/CreateRollCallButton.vue'
import RollCallEditor from '@/components/RollCallList/RollCallEditor.vue'
import RollCallList from '@/components/RollCallList/RollCallList.vue'

type Camp = components['schemas']['CampResponse']
type RollCallResponse = components['schemas']['RollCallResponse']
type RollCallRequest = components['schemas']['RollCallRequest']
type User = components['schemas']['UserResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const rollCalls = ref<RollCallResponse[]>([])
const participants = ref<User[]>([])
const questionGroups = ref<QuestionGroup[]>([])

const isModalOpen = ref(false)

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}
const fetchRollCalls = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}
const fetchParticipants = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}
const fetchQuestionGroups = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}
const createRollCall = async (rollcall: RollCallRequest) => {
  if (!camp.value) return
  const { data } = await apiClient.POST('/api/admin/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.value.id } },
    body: rollcall,
  })
  if (data) rollCalls.value.push(data)
}

onMounted(async () => {
  camp.value = await fetchCamp()
  rollCalls.value = (await fetchRollCalls()) ?? []
  participants.value = (await fetchParticipants()) ?? []
  questionGroups.value = (await fetchQuestionGroups()) ?? []
})

const handleCreateRollCall = async (rollcall: RollCallRequest) => {
  await createRollCall(rollcall)
  isModalOpen.value = false
}
</script>

<template>
  <v-container max-width="800">
    <roll-call-list :roll-calls="rollCalls"></roll-call-list>
    <create-roll-call-button @click="isModalOpen = true" />
  </v-container>
  <v-dialog v-model="isModalOpen" max-width="600" persistent>
    <roll-call-editor
      :participants="participants"
      :question-groups="questionGroups"
      @create="handleCreateRollCall"
      @cancel="isModalOpen = false"
    />
  </v-dialog>
</template>
