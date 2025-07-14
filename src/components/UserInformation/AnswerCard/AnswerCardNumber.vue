<script setup lang="ts">
import { ref, watch } from 'vue'
import AnswerCardBase from '@/components/UserInformation/AnswerCard/AnswerCardBase.vue'
import type { components } from '@/api/schema'
import type { VTextField } from 'vuetify/components'

const props = defineProps<{
  question: components['schemas']['FreeNumberQuestionResponse']
  answer?: components['schemas']['FreeNumberAnswerResponse'] // 未回答のときundefined
  userId: string
}>()

const emit = defineEmits<{
  (
    e: 'update',
    answerId: number | undefined,
    updatedAnswer: components['schemas']['AnswerRequest'],
  ): void
}>()

const editingContent = ref<number | undefined>(props.answer?.content)
const isEditing = ref<boolean>(false)
const textFieldRef = ref<VTextField | null>(null)

const startEditing = () => {
  isEditing.value = true
  textFieldRef.value?.focus()
}
const cancelEditing = () => {
  editingContent.value = props.answer?.content
  isEditing.value = false
}

const handleFocus = () => {
  if (editingContent.value === undefined) {
    editingContent.value = 0
  }
}

const updateAnswer = () => {
  if (editingContent.value === undefined) return
  const updatedAnswer: components['schemas']['AnswerRequest'] = {
    type: 'free_number',
    questionId: props.question.id,
    content: editingContent.value,
  }
  emit('update', props.answer?.id, updatedAnswer)
  isEditing.value = false
}

// userId, answerが変わったときに編集状態をリセット
watch([() => props.userId, () => props.answer], cancelEditing, { immediate: true })
</script>

<template>
  <answer-card-base
    :question-title="question.title"
    :AnswerExists="editingContent !== undefined"
    :isEditing="isEditing"
    :user-id="userId"
    @edit="startEditing"
    @cancel="cancelEditing"
    @save="updateAnswer"
  >
    <v-text-field
      ref="textFieldRef"
      v-model="editingContent"
      :class="{ 'disabled-field': !isEditing }"
      type="number"
      label="数値入力"
      hide-details
      @focus="handleFocus"
    />
  </answer-card-base>
</template>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
