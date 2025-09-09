<script setup lang="ts">
import { toRef } from 'vue'
import { useDisplay } from 'vuetify'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import QuestionResultDesktop from '@/components/QuestionsResult/QuestionResultDesktop.vue'
import QuestionResultMobile from '@/components/QuestionsResult/QuestionResultMobile.vue'
import { useAnswersForQuestionGroupQuery } from '@/api/queries/answers'
import type { components } from '@/api/schema'
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type User = components['schemas']['UserResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
  participants: User[]
}>()

const questionGroupId = toRef(() => props.questionGroup.id)
const { data: answers } = useAnswersForQuestionGroupQuery(questionGroupId)

const display = useDisplay()
const isSmAndUp = display.smAndUp
</script>

<template>
  <section-title :title="questionGroup.name" />
  <section-card v-if="answers !== undefined">
    <template v-if="isSmAndUp">
      <question-result-desktop
        v-for="question in questionGroup.questions"
        :key="question.id"
        :question="question"
        :answers="answers"
        :participants="participants"
      />
    </template>
    <template v-else>
      <question-result-mobile
        v-for="question in questionGroup.questions"
        :key="question.id"
        :question="question"
        :answers="answers"
        :participants="participants"
      />
    </template>
  </section-card>
</template>
