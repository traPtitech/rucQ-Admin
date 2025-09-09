<script setup lang="ts">
import { computed, toRef } from 'vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import AnswerCard from '@/components/UserInformation/AnswerCard.vue'
import {
  useAnswersForQuestionGroupQuery,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
} from '@/api/queries/answers'
import type { components } from '@/api/schema'
import type { Props as AnswerCardProps } from '@/components/UserInformation/AnswerCard.vue'
type AnswerRequest = components['schemas']['AnswerRequest']

const props = defineProps<{
  userId: string
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const userId = toRef(() => props.userId)
const questionGroupId = computed(() => props.questionGroup.id)
const { data: answers } = useAnswersForQuestionGroupQuery(questionGroupId, userId)
const { mutate: createAnswer } = useCreateAnswerMutation()
const { mutate: updateAnswer } = useUpdateAnswerMutation()

const findAnswer = <T extends components['schemas']['QuestionResponse']['type']>(
  questionId: number,
  type: T,
) => {
  return answers.value?.find((a) => a.questionId === questionId && a.type === type) as
    | Extract<components['schemas']['AnswerResponse'], { type: T }>
    | undefined
}

const saveAnswer = (answerId: number | undefined, updatedAnswer: AnswerRequest) => {
  if (answerId !== undefined) updateAnswer({ answerId, updatedAnswer })
  else createAnswer({ userId: props.userId, newAnswer: updatedAnswer })
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
  <section-card v-if="answers !== undefined">
    <answer-card
      v-for="answerCardProps in answerCardPropsArray"
      :key="answerCardProps.question.id"
      :props="answerCardProps"
      @update="saveAnswer"
    />
  </section-card>
  <section-card v-else>
    <p class="text-medium-emphasis">回答の取得に失敗しました</p>
  </section-card>
</template>
