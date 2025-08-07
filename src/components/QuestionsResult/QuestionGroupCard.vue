<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import QuestionResultDesktop from '@/components/QuestionsResult/QuestionResultDesktop.vue'
import QuestionResultMobile from '@/components/QuestionsResult/QuestionResultMobile.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Answer = components['schemas']['AnswerResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
  participants: string[]
}>()

const display = useDisplay()
const isSmAndUp = display.smAndUp
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
