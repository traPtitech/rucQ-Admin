<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import AnswerCard from '@/components/UserInformation/AnswerCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import type { Props as AnswerCardProps } from '@/components/UserInformation/AnswerCard.vue'

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

const findAnswer = <T extends components['schemas']['QuestionResponse']['type']>(
  questionId: number,
  type: T,
) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === type) as
    | Extract<components['schemas']['AnswerResponse'], { type: T }>
    | undefined
}

const updateAnswer = async (
  answerId: number | undefined,
  updatedAnswer: components['schemas']['AnswerRequest'],
) => {
  if (answerId !== undefined) {
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

const answerCardPropsArray = computed(() => {
  return props.questionGroup.questions.map((question) => {
    return {
      type: question.type,
      question: question,
      answer: findAnswer(question.id, question.type),
      userId: props.userId,
    } as AnswerCardProps
  })
})
</script>

<template>
  <section-card>
    <answer-card
      v-for="answerCardProps in answerCardPropsArray"
      :key="answerCardProps.question.id"
      :props="answerCardProps"
      @update="updateAnswer"
    />
  </section-card>
</template>
