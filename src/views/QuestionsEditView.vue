<script setup lang="ts">
import QuestionGroupCard from '@/components/QuestionsEdit/QuestionGroupCard.vue'
import QuestionGroupEditor from '@/components/QuestionsEdit/QuestionGroupEditor.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import { generateNewTemporaryId, isAssignedId, removeTemporaryId } from '@/utils/temporaryIdManager'

const newQuestionGroup: components['schemas']['QuestionGroupResponse'] = {
  id: generateNewTemporaryId(),
  name: '',
  description: '',
  due: '',
  questions: [],
}

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<components['schemas']['CampResponse']>()
const questionGroups = ref<components['schemas']['QuestionGroupResponse'][]>([])
const isCreatingNewGroup = ref(false)

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

const handleCreateQuestionGroup = async (
  questionGroup: components['schemas']['QuestionGroupResponse'],
) => {
  if (!camp.value) return
  if (isAssignedId(questionGroup.id)) return
  await apiClient.POST('/api/admin/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value.id } },
    body: removeTemporaryId(questionGroup),
  })
  await fetchQuestionGroups()
}

const handleDeleteQuestionGroup = async (questionGroupId: number) => {
  await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId } },
  })
  await fetchQuestionGroups()
}

const handleUpdateQuestionGroup = async (
  questionGroup: components['schemas']['QuestionGroupResponse'],
) => {
  console.log('Updating question group:', questionGroup)
  await apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: questionGroup.id } },
    body: removeTemporaryId(questionGroup as components['schemas']['QuestionGroupRequest']),
  })
  await fetchQuestionGroups()
}

onMounted(async () => {
  await fetchCamp()
  await fetchQuestionGroups()
})
</script>

<template>
  <v-container max-width="800" class="d-flex flex-column ga-6">
    <question-group-card
      v-for="group in questionGroups"
      :key="group.id"
      :question-group="group"
      @delete="handleDeleteQuestionGroup"
      @update="handleUpdateQuestionGroup"
    />
    <div v-if="!isCreatingNewGroup" class="d-flex justify-center">
      <v-btn
        color="primary"
        class="flex-grow-1"
        prepend-icon="mdi-plus"
        max-width="400"
        @click="isCreatingNewGroup = true"
      >
        新規作成
      </v-btn>
    </div>
    <question-group-editor
      v-else
      :question-group="newQuestionGroup"
      @cancel="isCreatingNewGroup = false"
      @update="handleCreateQuestionGroup"
    />
  </v-container>
</template>
