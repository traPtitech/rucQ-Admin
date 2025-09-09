<script setup lang="ts">
import { ref, computed } from 'vue'
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
const selectedIDs = ref<string[]>([])
const onSelected = async () => {
  const userIds = (
    await Promise.all(
      selectedIDs.value.map(async (id) => {
        const [questionId, optionId] = (id as string)
          .split('-')
          .map((s) => Number(s))
          .slice(1)
        const { data } = await apiClient.GET('/api/admin/questions/{questionId}/answers', {
          params: { path: { questionId } },
        })
        if (!data) return []
        return (data as SelectQuestion[])
          .filter((a) =>
            a.type === 'single'
              ? a.selectedOption.id === optionId
              : a.selectedOptions.some((o) => o.id === optionId),
          )
          .map((a) => a.userId)
      }),
    )
  ).flat()
  target.value = [...new Set(userIds)].join(' ')
}

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
</script>

<template>
  <v-card>
    <v-treeview
      :v-model="selectedIDs"
      :items="treeItems"
      select-strategy="classic"
      item-value="id"
      selectable
      single-line
      @click:select="onSelected"
    />
  </v-card>
</template>
