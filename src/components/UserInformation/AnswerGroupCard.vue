<script setup lang="ts">
import { ref, watch } from 'vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import AnswerCard from '@/components/UserInformation/AnswerCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

type QuestionType = components['schemas']['QuestionResponse']['type']

const props = defineProps<{
  userId: string
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const answers = ref<components['schemas']['AnswerResponse'][]>([])

const fetchAnswers = async () => {
  const { data } = await apiClient.GET('/api/admin/question-groups/{questionGroupId}/answers', {
    params: { path: { questionGroupId: props.questionGroup.id }, query: { userId: props.userId } },
  })
  return data ?? []
}

// userIdが変わったときに回答を再取得
watch(
  () => props.userId,
  async () => {
    answers.value = await fetchAnswers()
  },
  { immediate: true },
)

const findAnswer = <T extends QuestionType>(questionId: number, type: T) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === type) as
    | Extract<components['schemas']['AnswerResponse'], { type: T }>
    | undefined
}

const updateAnswer = async (
  answerId: number | undefined,
  updatedAnswer: components['schemas']['AnswerRequest'],
) => {
  if (answerId) {
    await apiClient.PUT('/api/admin/answers/{answerId}', {
      params: { path: { answerId: answerId } },
      body: updatedAnswer,
    })
  } else {
    await apiClient.POST('/api/admin/users/{userId}/answers', {
      params: { path: { userId: props.userId } },
      body: updatedAnswer,
    })
  }
  answers.value = await fetchAnswers()
}

type Props = {
  [T in QuestionType]: {
    type: T
    userId: string
    question: Extract<components['schemas']['QuestionResponse'], { type: T }>
    answer?: Extract<components['schemas']['AnswerResponse'], { type: T }> // 未回答のときundefined
  }
}[QuestionType]
const answerCardProps = <T extends QuestionType>(
  type: T,
  question: components['schemas']['QuestionResponse'],
): Props => {
  return {
    type: type,
    userId: props.userId,
    question: question as Extract<components['schemas']['QuestionResponse'], { type: T }>,
    answer: findAnswer(question.id, type),
  } as Props
}
</script>

<template>
  <section-card>
    <template v-for="question in questionGroup.questions" :key="question.id">
      <answer-card :props="answerCardProps(question.type, question)" @update="updateAnswer" />
    </template>
  </section-card>
</template>
