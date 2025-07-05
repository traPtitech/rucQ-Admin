<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QuestionGroupCard from '@/components/QuestionsEdit/QuestionGroupCard.vue'
import QuestionGroupEditor from '@/components/QuestionsEdit/QuestionGroupEditor.vue'
import { apiClient } from '@/api/apiClient'
import { generateNewTemporaryId, isAssignedId, removeTemporaryId } from '@/utils/temporaryIdManager'
import type { components } from '@/api/schema'
type QuestionGroup = components['schemas']['QuestionGroupResponse']

const newQuestionGroup: QuestionGroup = {
  id: generateNewTemporaryId(),
  name: '',
  description: '',
  due: '',
  questions: [],
}

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<components['schemas']['CampResponse']>()
const questionGroups = ref<QuestionGroup[]>([])
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

const handleCreateQuestionGroup = async (questionGroup: QuestionGroup) => {
  if (!camp.value) return
  if (isAssignedId(questionGroup.id)) return
  await apiClient.POST('/api/admin/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value.id } },
    body: removeTemporaryId(questionGroup),
  })
  isCreatingNewGroup.value = false
  await fetchQuestionGroups()
}

const handleDeleteQuestionGroup = async (questionGroupId: number) => {
  await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId } },
  })
  await fetchQuestionGroups()
}

// TODO: 書き直す
const handleUpdateQuestionGroup = async (updatedGroup: QuestionGroup) => {
  type QuestionGroupUpdate = components['schemas']['PutQuestionGroupRequest'] & {
    id: number
    questions: (
      | components['schemas']['QuestionResponse']
      | components['schemas']['PostQuestionRequest']
    )[]
  }
  const questionGroup = questionGroups.value.find((g) => g.id === updatedGroup.id)
  if (!questionGroup) return
  const formattedUpdatedGroup = removeTemporaryId(updatedGroup as QuestionGroupUpdate)
  await apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: formattedUpdatedGroup.id } },
    body: {
      name: formattedUpdatedGroup.name,
      description: formattedUpdatedGroup.description,
      due: formattedUpdatedGroup.due,
    },
  })
  for (const question of formattedUpdatedGroup.questions) {
    if ('id' in question) {
      await apiClient.PUT('/api/admin/questions/{questionId}', {
        params: { path: { questionId: question.id } },
        body: question,
      })
    } else {
      await apiClient.POST('/api/admin/question-groups/{questionGroupId}/questions', {
        params: { path: { questionGroupId: formattedUpdatedGroup.id } },
        body: question,
      })
    }
  }

  for (const question of questionGroup.questions) {
    if (!formattedUpdatedGroup.questions.some((q) => 'id' in q && q.id === question.id)) {
      await apiClient.DELETE('/api/admin/questions/{questionId}', {
        params: { path: { questionId: question.id } },
      })
    }
  }
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
