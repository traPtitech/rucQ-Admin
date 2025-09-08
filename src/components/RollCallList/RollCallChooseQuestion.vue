<script setup lang="ts">
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']

const target = defineModel<string>({ required: true })

const { questionGroups } = defineProps<{
  questionGroups: QuestionGroup[]
}>()
const filteredQuestionGroups = questionGroups.filter((g) =>
  g.questions.some((q: Question) => q.type === 'single' || q.type === 'multiple'),
)
const onClicked = async (questionId: number, optionId: number) => {
  const { data } = await apiClient.GET('/api/admin/questions/{questionId}/answers', {
    params: { path: { questionId } },
  })
  if (!data) return
  if (data.every((a) => a.type === 'single')) {
    target.value = data
      .filter((a) => a.selectedOption.id === optionId)
      .map((a) => a.userId)
      .join(' ')
  }
  if (data.every((a) => a.type === 'multiple')) {
    target.value = data
      .filter((a) => a.selectedOptions.some((o) => o.id === optionId))
      .map((a) => a.userId)
      .join(' ')
  }
}
</script>

<template>
  <v-card>
    <v-list>
      <v-list-group
        v-for="group in filteredQuestionGroups"
        :key="group.id"
        :value="`${group.id}`"
        :title="group.name"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="group.name" :value="`${group.id}`" />
        </template>
        <v-list-group
          v-for="question in group.questions.filter(
            (q) => q.type === 'single' || q.type === 'multiple',
          )"
          :key="question.id"
          :value="`${group.id}-${question.id}`"
          :title="question.title"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="question.title" :value="question.id" />
          </template>
          <v-list-item
            v-for="option in question.options"
            :key="option.id"
            :value="`${group.id}-${question.id}-${option.id}`"
            :title="option.content"
            @click="onClicked(question.id, option.id)"
          />
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-card>
</template>
