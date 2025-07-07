<script setup lang="ts">
import { computed } from 'vue'
import { parseISO, format } from 'date-fns'
import QuestionItem from '@/components/QuestionsEdit/QuestionItem.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const formatDueDate = computed(() => {
  if (!props.questionGroup.due) return
  const dueDate = parseISO(props.questionGroup.due)
  return format(dueDate, 'yyyy/MM/dd')
})
</script>

<template>
  <v-sheet elevation="2" class="d-flex flex-column ga-2 pa-4">
    <div class="mb-2">
      <div class="d-flex align-end justify-between ga-2">
        <h2>{{ questionGroup.name }}</h2>
        <span class="text-body-2 text-medium-emphasis pb-1"> {{ formatDueDate }} まで </span>
      </div>
      <p>{{ questionGroup.description }}</p>
    </div>
    <div class="d-flex flex-column ga-2">
      <question-item
        v-for="question in questionGroup.questions"
        :key="question.id"
        :question="question"
      />
    </div>
    <v-btn color="primary" class="mt-2 w-auto align-self-end" @click="emit('edit')"> 編集 </v-btn>
  </v-sheet>
</template>
