<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type SelectQuestion =
  | components['schemas']['SingleChoiceAnswerResponse']
  | components['schemas']['MultipleChoiceAnswerResponse']

const target = defineModel<string>({ required: true })
interface itemType {
  id: string
  title: string
  data: { questionId: number; optionId: number }
}
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
const selectedIDs = ref<itemType[]>([])
const answers = ref<SelectQuestion[]>([])
const fetchAnswers = async () => {
  return (
    await Promise.all(
      filteredQuestionGroups.value
        .map((g) => g.questions)
        .map(async (qs) => {
          return Promise.all(
            qs.map(async (q) => {
              const { data } = await apiClient.GET('/api/admin/questions/{questionId}/answers', {
                params: { path: { questionId: q.id } },
              })
              return data as SelectQuestion[]
            }),
          )
        }),
    )
  ).flat(2)
}
const onSelected = async () => {
  const userIds = selectedIDs.value
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

watch(() => selectedIDs.value, onSelected, { deep: true })

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

onMounted(async () => {
  answers.value = await fetchAnswers()
})
</script>

<template>
  <v-card>
    <v-treeview
      v-model:selected="selectedIDs"
      :items="treeItems"
      select-strategy="leaf"
      item-value="id"
      selectable
      return-object
      single-line
    />
  </v-card>
</template>
