<script setup lang="ts">
import QuestionItem from '@/components/QuestionsEdit/QuestionItem.vue'
import { ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const props = defineProps<{
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const editMode = ref(false)

const editedQuestionGroup = ref<components['schemas']['QuestionGroupResponse']>(props.questionGroup)

const saveQuestionGroup = async () => {
  apiClient.PUT('/api/admin/question-groups/{questionGroupId}', {
    params: { path: { questionGroupId: props.questionGroup.id } },
    body: editedQuestionGroup.value,
  })
  // TODO: 質問追加にも対応
}
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

  <v-sheet v-else elevation="4" class="d-flex flex-column ga-2 pa-4">
    <div class="mb-2">
      <h2>{{ editedQuestionGroup.name }}</h2>
      <p>{{ editedQuestionGroup.description }}</p>
    </div>
    <div class="d-flex flex-column ga-2">
      <question-item
        v-for="question in editedQuestionGroup.questions"
        :key="question.id"
        :question="question"
      />
    </div>
    <v-btn color="primary" class="mt-2 w-auto align-self-end" @click="saveQuestionGroup">
      保存
    </v-btn>
  </v-sheet>
</template>
