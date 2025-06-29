<script setup lang="ts">
import QuestionGroupItem from '@/components/QuestionsEdit/QuestionGroupItem.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<components['schemas']['CampResponse']>()
const questionGroups = ref<components['schemas']['QuestionGroupResponse'][]>([])

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  camp.value = data?.find((c) => c.displayId === campname)
}

const fetchQuestionGroups = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value.id } },
  })
  questionGroups.value = data ?? []
}

// const handleCreateQuestionGroup = async (
//   questionGroup: components['schemas']['QuestionGroupRequest'],
// ) => {
//   if (!camp.value) return
//   await apiClient.POST('/api/admin/camps/{campId}/question-groups', {
//     params: { path: { campId: camp.value.id } },
//     body: questionGroup,
//   })
//   await fetchQuestionGroups()
// }

const handleUpdateQuestionGroup = async (
  questionGroupId: number,
  updatedQuestionGroup: components['schemas']['QuestionGroupRequest'],
) => {
  await apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: questionGroupId } },
    body: updatedQuestionGroup,
  })
  await fetchQuestionGroups()
}

const handleDeleteQuestionGroup = async (questionGroupId: number) => {
  await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId } },
  })
  await fetchQuestionGroups()
}

onMounted(async () => {
  await fetchCamp()
  await fetchQuestionGroups()
})
</script>

<template>
  <v-container max-width="800" class="d-flex flex-column justify-center ga-6">
    <question-group-item
      v-for="group in questionGroups"
      :key="group.id"
      :question-group="group"
      @update="handleUpdateQuestionGroup"
      @delete="handleDeleteQuestionGroup"
    />
  </v-container>
</template>
