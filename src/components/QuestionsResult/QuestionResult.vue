<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import QuestionResultTableDesktop from '@/components/QuestionsResult/QuestionResultTableDesktop.vue'
import QuestionResultTableMobile from '@/components/QuestionsResult/QuestionResultTableMobile.vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import {
  groupFreeTextAnswers,
  groupFreeNumberAnswers,
  groupSingleChoiceAnswers,
  groupMultipleChoiceAnswers,
  type GroupedAnswer,
} from '@/components/QuestionsResult/group-answers'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type Answer = components['schemas']['AnswerResponse']

const props = defineProps<{
  question: Question
  answers: Answer[]
  participants: string[]
}>()

const display = useDisplay()
const isSmAndUp = display.smAndUp
const isModalOpen = ref(false)

const groupedAnswers = computed<GroupedAnswer[]>(() => {
  switch (props.question.type) {
    case 'free_text':
      return groupFreeTextAnswers(props.question, props.answers)
    case 'free_number':
      return groupFreeNumberAnswers(props.question, props.answers)
    case 'single':
      return groupSingleChoiceAnswers(props.question, props.answers)
    case 'multiple':
      return groupMultipleChoiceAnswers(props.question, props.answers)
    default:
      const _exhaustiveCheck: never = props.question
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as Question).type}`)
  }
})
const unansweredUsers = computed<string[]>(() => {
  const filteredAnswers = props.answers.filter((answer) => answer.questionId === props.question.id)
  const answeredUserIds = new Set(filteredAnswers.map((answer) => answer.userId))
  return props.participants.filter((userId) => !answeredUserIds.has(userId))
})
</script>

<template>
  <content-card v-if="isSmAndUp">
    <h3 class="py-2">{{ props.question.title }}</h3>
    <v-divider />
    <question-result-table-desktop
      :grouped-answers="groupedAnswers"
      :unanswered-users="unansweredUsers"
    />
  </content-card>
  <content-card v-else @click="isModalOpen = true">
    <h3>{{ props.question.title }}</h3>
    <question-result-table-mobile
      :question-title="props.question.title"
      :grouped-answers="groupedAnswers"
      :unanswered-users="unansweredUsers"
      v-model="isModalOpen"
    />
  </content-card>
</template>
