<script setup lang="ts">
import { ref, watch } from 'vue'
import AnswerCardBase from '@/components/UserInformation/AnswerCard/AnswerCardBase.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  question: components['schemas']['MultipleChoiceQuestionResponse']
  answer?: components['schemas']['MultipleChoiceAnswerResponse'] // 未回答のときundefined
  userId: string
}>()

const emit = defineEmits<{
  (
    e: 'update',
    answerId: number | undefined,
    updatedAnswer: components['schemas']['AnswerRequest'],
  ): void
}>()

// multiple だけ answer が undefined のときに空配列で初期化(他は undefined)
const editingSelectedOptionIds = ref<number[]>(props.answer?.selectedOptions.map((o) => o.id) ?? [])
const isEditing = ref<boolean>(false)

const cancelEditing = () => {
  editingSelectedOptionIds.value = props.answer?.selectedOptions.map((o) => o.id) ?? []
  isEditing.value = false
}

const updateAnswer = () => {
  const updatedAnswer: components['schemas']['AnswerRequest'] = {
    type: 'multiple',
    questionId: props.question.id,
    optionIds: editingSelectedOptionIds.value,
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
    :AnswerExists="answer !== undefined || isEditing"
    :isEditing="isEditing"
    :user-id="userId"
    @edit="isEditing = true"
    @cancel="cancelEditing"
    @save="updateAnswer"
  >
    <div>
      <v-checkbox
        v-for="option in question.options"
        :key="option.id"
        v-model="editingSelectedOptionIds"
        :class="{ 'disabled-field': !isEditing }"
        class="ml-1"
        :label="option.content"
        :value="option.id"
        density="compact"
        hide-details
      />
    </div>
  </answer-card-base>
</template>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
