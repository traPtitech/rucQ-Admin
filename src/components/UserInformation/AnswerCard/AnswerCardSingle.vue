<script setup lang="ts">
import { ref, watch } from 'vue'
import AnswerCardBase from '@/components/UserInformation/AnswerCard/AnswerCardBase.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  question: components['schemas']['SingleChoiceQuestionResponse']
  answer?: components['schemas']['SingleChoiceAnswerResponse'] // 未回答のときundefined
  userId: string
}>()

const emit = defineEmits<{
  (
    e: 'update',
    answerId: number | undefined,
    updatedAnswer: components['schemas']['AnswerRequest'],
  ): void
}>()

const editingSelectedOptionId = ref<number | undefined>(props.answer?.selectedOption.id)
const isEditing = ref<boolean>(false)

const cancelEditing = () => {
  editingSelectedOptionId.value = props.answer?.selectedOption.id
  isEditing.value = false
}

const updateAnswer = () => {
  if (editingSelectedOptionId.value === undefined) return
  const updatedAnswer: components['schemas']['AnswerRequest'] = {
    type: 'single',
    questionId: props.question.id,
    optionId: editingSelectedOptionId.value,
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
    :AnswerExists="editingSelectedOptionId !== undefined"
    :isEditing="isEditing"
    :user-id="userId"
    @edit="isEditing = true"
    @cancel="cancelEditing"
    @save="updateAnswer"
  >
    <v-radio-group v-model="editingSelectedOptionId" hide-details>
      <v-radio
        v-for="option in question.options"
        :key="option.id"
        :class="{ 'disabled-field': !isEditing }"
        :label="option.content"
        :value="option.id"
      />
    </v-radio-group>
  </answer-card-base>
</template>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
