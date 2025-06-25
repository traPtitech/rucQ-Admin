<script setup lang="ts">
import QuestionGroupItem from '@/components/QuestionsEdit/QuestionGroupItem.vue'
import CreateQuestionGroupButton from '@/components/QuestionsEdit/CreateQuestionGroupButton.vue'
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

const updateQuestionGroupSummary = async (
  questionGroupId: number,
  questionGroupSummary: components['schemas']['QuestionGroupRequest'],
) => {
  const index = questionGroups.value.findIndex((qg) => qg.id === questionGroupId)
  if (index === -1) return
  const { data, error } = await apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: questionGroupId } },
    body: questionGroupSummary,
  })
  if (error) console.error('Error updating question group summary:', error)
  else questionGroups.value[index] = data
}

const updateQuestion = async (question: components['schemas']['QuestionResponse']) => {
  const { data, error } = await apiClient.PUT('/api/admin/questions/{questionId}', {
    params: { path: { questionId: question.id } },
    body: question,
  })
  if (error) {
    console.error('Error updating question:', error)
    return
  }
  const groupIndex = questionGroups.value.findIndex((qg) => qg.id === question.questionGroupId)
  if (groupIndex !== -1) {
    const questionIndex = questionGroups.value[groupIndex].questions.findIndex(
      (q) => q.id === question.id,
    )
    if (questionIndex !== -1) {
      questionGroups.value[groupIndex].questions[questionIndex] = data
    }
  }
}

const createQuestion = async (newQuestion: components['schemas']['QuestionRequest']) => {
  const index = questionGroups.value.findIndex((qg) => qg.id === newQuestion.questionGroupId)
  if (index !== -1) return
  const { data, error } = await apiClient.POST('/api/admin/questions', { body: newQuestion })
  if (error) {
    console.error('Error creating question:', error)
    return
  }
  questionGroups.value[index].questions.push(data)
}

const updateQuestionGroup = async (
  questionGroup: components['schemas']['QuestionGroupResponse'],
  newQuestions: components['schemas']['QuestionRequest'][],
) => {
  await updateQuestionGroupSummary(questionGroup.id, questionGroup)
  for (const question of questionGroup.questions) await updateQuestion(question)
  for (const newQuestion of newQuestions) await createQuestion(newQuestion)
  fetchQuestionGroups()
}

const deleteQuestionGroup = async (questionGroupId: number) => {
  const index = questionGroups.value.findIndex((qg) => qg.id === questionGroupId)
  if (index === -1) return
  const { error } = await apiClient.DELETE('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: questionGroupId } },
  })
  if (error) console.error('Error deleting question group:', error)
  else questionGroups.value.splice(index, 1)
  fetchQuestionGroups()
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
      @update-question-group="updateQuestionGroup"
      @delete-question-group="deleteQuestionGroup"
    />
    <create-question-group-button />
  </v-container>
</template>
