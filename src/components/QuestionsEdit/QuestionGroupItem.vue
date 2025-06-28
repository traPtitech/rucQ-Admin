<script setup lang="ts">
import QuestionItem from '@/components/QuestionsEdit/QuestionItem.vue'
import type { components } from '@/api/schema'

defineProps<{
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()
</script>

<template>
  <v-sheet elevation="2" class="d-flex flex-column ga-2 pa-4">
    <div class="mb-2">
      <h2>{{ questionGroup.name }}</h2>
      <p>{{ questionGroup.description }}</p>
    </div>
    <div class="d-flex flex-column ga-2">
      <question-item
        v-for="question in questionGroup.questions"
        :key="question.id"
        :question="question"
      />
    </div>
    <v-btn color="primary" class="mt-2 w-auto align-self-end"> 編集 </v-btn>
  </v-sheet>
</template>
