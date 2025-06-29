<script setup lang="ts">
import QuestionItem from '@/components/QuestionsEdit/QuestionItem.vue'
import QuestionItemEditor from '@/components/QuestionsEdit/QuestionItemEditor.vue'
import { ref, watch, toRaw } from 'vue'
import type { components } from '@/api/schema'

type QuestionGroupRequest = components['schemas']['QuestionGroupRequest']

const props = defineProps<{
  questionGroup: components['schemas']['QuestionGroupResponse']
}>()

const emit = defineEmits<{
  (e: 'update', questionGroupId: number, questionGroup: QuestionGroupRequest): void
  (e: 'delete', questionGroupId: number): void
}>()

const editMode = ref(false)
const editingQuestionGroup = ref<QuestionGroupRequest>(structuredClone(toRaw(props.questionGroup)))

const resetEditingState = () => {
  editMode.value = false
  editingQuestionGroup.value = structuredClone(toRaw(props.questionGroup))
}

watch(() => props.questionGroup, resetEditingState, { deep: true })
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
    <div class="">
      <v-text-field v-model="editingQuestionGroup.name" placeholder="タイトル" />
      <v-textarea v-model="editingQuestionGroup.description" placeholder="説明" rows="1" auto-grow />
    </div>
    <div class="d-flex flex-column ga-2">
      <question-item-editor
        v-for="(question, index) in editingQuestionGroup.questions"
        :key="question.id"
        v-model="editingQuestionGroup.questions[index]"
      />
    </div>
    <div class="d-flex ga-2 mt-2 align-self-end">
      <v-btn color="secondary" class="w-auto ml-2" @click="resetEditingState"> キャンセル </v-btn>
      <v-btn color="error" class="w-auto" @click="emit('delete', questionGroup.id)"> 削除 </v-btn>
      <v-btn
        color="primary"
        class="w-auto"
        @click="emit('update', questionGroup.id, editingQuestionGroup)"
      >
        保存
      </v-btn>
    </div>
  </v-sheet>
</template>
