<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']
type SelectQuestion =
  | components['schemas']['SingleChoiceAnswerResponse']
  | components['schemas']['MultipleChoiceAnswerResponse']

const target = defineModel<string>({ required: true })

const { questionGroups } = defineProps<{
  questionGroups: QuestionGroup[]
}>()
const filteredQuestionGroups = computed(() =>
  questionGroups
    .filter((g) => g.questions.some((q: Question) => q.type === 'single' || q.type === 'multiple'))
    .map((g) => ({
      ...g,
      questions: g.questions.filter((q: Question) => q.type === 'single' || q.type === 'multiple'),
    })),
)
const _selectedIDs = ref<string[]>([])
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
  console.log(selectedIDs.value)
  const userIds = selectedIDs.value
    .map((id) => {
      const [questionId, optionId] = (id as string)
        .split('-')
        .map((s) => Number(s))
        .slice(1)
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
const selectedIDs = computed({
  get: () => _selectedIDs.value,
  set: (val: string[]) => {
    _selectedIDs.value = val
    onSelected()
  },
})

const treeItems = computed(() =>
  filteredQuestionGroups.value.map((g) => ({
    id: `${g.id}`,
    title: g.name,
    children: g.questions.map((q) => ({
      id: `${g.id}-${q.id}`,
      title: q.title,
      children: q.options.map((o) => ({
        id: `${g.id}-${q.id}-${o.id}`,
        title: o.content,
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
      select-strategy="classic"
      item-value="id"
      selectable
      single-line
    />
  </v-card>
</template>
