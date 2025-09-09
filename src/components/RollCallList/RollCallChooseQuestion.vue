<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type ChoiceQuestionAnswer =
  | components['schemas']['SingleChoiceAnswerResponse']
  | components['schemas']['MultipleChoiceAnswerResponse']
interface ItemType {
  id: string
  title: string
  data: { questionId: number; optionId: number }
}

const target = defineModel<string>({ required: true })
const { questionGroups } = defineProps<{
  questionGroups: QuestionGroup[]
}>()

const filteredQuestionGroups = computed(() =>
  questionGroups
    .map((g) => ({
      ...g,
      questions: g.questions.filter((q: Question) => q.type === 'single' || q.type === 'multiple'),
    }))
    .filter((g) => g.questions.length > 0),
)

const answers = ref<ChoiceQuestionAnswer[]>([])
const fetchAnswersForQuestion = async (questionId: number) => {
  const { data } = await apiClient.GET('/api/admin/questions/{questionId}/answers', {
    params: { path: { questionId } },
  })
  return data as ChoiceQuestionAnswer[]
}
const fetchAnswers = async (questionIds: number[]) => {
  const responses = await Promise.all(questionIds.map((id) => fetchAnswersForQuestion(id)))
  return responses.flat()
}

const selectedItems = ref<ItemType[]>([])
const onSelected = async () => {
  const userIds = selectedItems.value
    .map((id) => {
      const { questionId, optionId } = id.data
      return answers.value
        .filter((a) => a.questionId === questionId)
        .filter((a) =>
          a.type === 'single'
            ? a.selectedOption.id === optionId
            : a.selectedOptions.some((o) => o.id === optionId),
        )
        .map((a) => a.userId)
    })
    .flat()
  target.value = [...new Set(userIds)].join(' ')
}

watch(() => selectedItems.value, onSelected, { deep: true })
onMounted(async () => {
  const questionIds = filteredQuestionGroups.value.flatMap((g) => g.questions.map((q) => q.id))
  answers.value = await fetchAnswers(questionIds)
})

const treeItems = computed(() =>
  filteredQuestionGroups.value.map((g) => ({
    id: `group-${g.id}`,
    title: g.name,
    children: g.questions.map((q) => ({
      id: `question-${q.id}`,
      title: q.title,
      children: q.options.map((o) => ({
        id: `option-${o.id}`,
        title: o.content,
        data: { questionId: q.id, optionId: o.id },
      })),
    })),
  })),
)
</script>

<template>
  <v-card>
    <v-treeview
      v-model:selected="selectedItems"
      :items="treeItems"
      select-strategy="leaf"
      item-value="id"
      selectable
      return-object
    />
  </v-card>
</template>
