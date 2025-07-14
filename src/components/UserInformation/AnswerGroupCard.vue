<script setup lang="ts">
import { ref, watch } from 'vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import AnswerCardText from '@/components/UserInformation/AnswerCard/AnswerCardText.vue'
import AnswerCardNumber from '@/components/UserInformation/AnswerCard/AnswerCardNumber.vue'
import AnswerCardSingle from '@/components/UserInformation/AnswerCard/AnswerCardSingle.vue'
import AnswerCardMultiple from '@/components/UserInformation/AnswerCard/AnswerCardMultiple.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const props = defineProps<{
  userId: string
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const answers = ref<components['schemas']['AnswerResponse'][]>([])

const fetchAnswers = async () => {
  // TODO: エンドポイントを実際のものに変更する
  const { data } = await apiClient.GET('/api/me/question-groups/{questionGroupId}/answers', {
    params: { path: { questionGroupId: props.questionGroup.id } },
  })
  return data ?? []
}

watch(
  () => props.userId,
  async () => {
    answers.value = await fetchAnswers()
  },
  { immediate: true },
)

const findAnswerText = (questionId: number) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === 'free_text') as
    | components['schemas']['FreeTextAnswerResponse']
    | undefined
}
const findAnswerNumber = (questionId: number) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === 'free_number') as
    | components['schemas']['FreeNumberAnswerResponse']
    | undefined
}
const findAnswerSingle = (questionId: number) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === 'single') as
    | components['schemas']['SingleChoiceAnswerResponse']
    | undefined
}
const findAnswerMultiple = (questionId: number) => {
  return answers.value.find((a) => a.questionId === questionId && a.type === 'multiple') as
    | components['schemas']['MultipleChoiceAnswerResponse']
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
    // TODO: POSTエンドポイント実装されたら追加
  }
}
</script>

<template>
  <section-card>
    <template v-for="question in questionGroup.questions" :key="question.id">
      <answer-card-text
        v-if="question.type === 'free_text'"
        :question="question"
        :answer="findAnswerText(question.id)"
        :user-id="userId"
        @update="updateAnswer"
      />
      <answer-card-number
        v-if="question.type === 'free_number'"
        :question="question"
        :answer="findAnswerNumber(question.id)"
        :user-id="userId"
        @update="updateAnswer"
      />
      <answer-card-single
        v-if="question.type === 'single'"
        :question="question"
        :answer="findAnswerSingle(question.id)"
        :user-id="userId"
        @update="updateAnswer"
      />
      <answer-card-multiple
        v-if="question.type === 'multiple'"
        :question="question"
        :answer="findAnswerMultiple(question.id)"
        :user-id="userId"
        @update="updateAnswer"
      />
    </template>
  </section-card>
</template>
