<script setup lang="ts">
import QuestionItem from '@/components/QuestionsEdit/QuestionItem.vue'
import QuestionGroupEditor from './QuestionGroupEditor.vue'
import { ref } from 'vue'
import type { components } from '@/api/schema'

type QuestionGroupResponse = components['schemas']['QuestionGroupResponse']

defineProps<{
  questionGroup: QuestionGroupResponse
}>()

const emit = defineEmits<{
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroupId: number, questionGroup: QuestionGroupResponse): void
}>()

const editMode = ref(false)
</script>

<template>
  <v-sheet v-if="!editMode" elevation="2" class="d-flex flex-column ga-2 pa-4">
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
    <v-btn color="primary" class="mt-2 w-auto align-self-end" @click="editMode = true">
      編集
    </v-btn>
  </v-sheet>
  <question-group-editor
    v-else
    :question-group="questionGroup"
    @cancel="editMode = false"
    @delete="emit('delete', questionGroup.id)"
    @update="emit('update', questionGroup.id, questionGroup)"
  />
</template>
