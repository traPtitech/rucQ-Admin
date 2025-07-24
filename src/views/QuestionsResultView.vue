<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import QuestionGroupCard from '@/components/QuestionsResult/QuestionGroupCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const questionGroups = ref<QuestionGroup[]>([])
const participants = ref<string[]>([])

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}
const fetchQuestionGroups = async () => {
  if (!camp.value) return []
  const { data } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value?.id } },
  })
  return data ?? []
}
const fetchParticipants = async () => {
  if (!camp.value) return []
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value?.id } },
  })
  return data?.map((participant) => participant.id) ?? []
}

onMounted(async () => {
  camp.value = await fetchCamp()
  const [fetchedQuestionGroups, fetchedParticipants] = await Promise.all([
    fetchQuestionGroups(),
    fetchParticipants(),
  ])
  questionGroups.value = fetchedQuestionGroups
  participants.value = fetchedParticipants
})
</script>

<template>
  <v-container max-width="1200">
    <question-group-card
      v-for="questionGroup in questionGroups"
      :key="questionGroup.id"
      :question-group="questionGroup"
      :participants="participants"
    />
  </v-container>
</template>
