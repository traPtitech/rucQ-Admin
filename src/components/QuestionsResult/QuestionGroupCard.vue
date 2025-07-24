<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import QuestionResult from '@/components/QuestionsResult/QuestionResult.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Answer = components['schemas']['AnswerResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
  participants: string[]
}>()

const answers = ref<Answer[]>([])

const fetchAnswers = async () => {
  const { data } = await apiClient.GET('/api/admin/question-groups/{questionGroupId}/answers', {
    params: { path: { questionGroupId: props.questionGroup.id } },
  })
  return data ?? []
}

onMounted(async () => {
  answers.value = await fetchAnswers()
})
</script>

<template>
  <section-title :title="questionGroup.name" />
  <section-card>
    <question-result
      v-for="question in questionGroup.questions"
      :key="question.id"
      :question="question"
      :answers="answers"
      :participants="participants"
    />
  </section-card>
</template>
