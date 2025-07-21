<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AnswerCardBase from '@/components/UserInformation/AnswerCardBase.vue'
import type { components } from '@/api/schema'
import type { VTextField, VNumberInput } from 'vuetify/components'

type QuestionType = 'free_text' | 'free_number' | 'single' | 'multiple'
export type Props = {
  [T in QuestionType]: {
    type: T
    userId: string
    question: Extract<components['schemas']['QuestionResponse'], { type: T }>
    answer?: Extract<components['schemas']['AnswerResponse'], { type: T }> // 未回答のときundefined
  }
}[QuestionType]
type EditingAnswer = {
  [T in QuestionType]: Partial<
    Omit<Extract<components['schemas']['AnswerRequest'], { type: T }>, 'type' | 'questionId'>
  > & { type: T }
}[QuestionType]

const { props } = defineProps<{ props: Props }>()

const emit = defineEmits<{
  (
    e: 'update',
    answerId: number | undefined,
    updatedAnswer: components['schemas']['AnswerRequest'],
  ): void
}>()

const editingAnswer = ref<EditingAnswer>()
const isEditing = ref<boolean>(false)
const freeTextFieldRef = ref<VTextField | null>(null)
const freeNumberFieldRef = ref<VNumberInput | null>(null)

const initializeEditingAnswer = () => {
  editingAnswer.value = (() => {
    switch (props.type) {
      case 'free_text':
        return { type: props.type, content: props.answer?.content ?? '' }
      case 'free_number':
        return { type: props.type, content: props.answer?.content ?? undefined }
      case 'single':
        return { type: props.type, optionId: props.answer?.selectedOption.id ?? undefined }
      case 'multiple':
        return { type: props.type, optionIds: props.answer?.selectedOptions.map((o) => o.id) ?? [] }
      default:
        const _exhaustiveCheck: never = props
        throw new Error(`Unexpected type: ${(_exhaustiveCheck as Props).type}`)
    }
  })()
}

const isEmptyAnswer = computed<boolean>(() => {
  if (editingAnswer.value === undefined) return true
  switch (editingAnswer.value.type) {
    case 'free_text':
      return editingAnswer.value?.content == null
    case 'free_number':
      return editingAnswer.value?.content == null
    case 'single':
      return editingAnswer.value?.optionId == null
    case 'multiple':
      return editingAnswer.value?.optionIds == null
    default:
      const _exhaustiveCheck: never = editingAnswer.value
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as EditingAnswer).type}`)
  }
})

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  if (editingAnswer.value?.type === 'free_text') {
    freeTextFieldRef.value?.focus()
  }
  if (editingAnswer.value?.type === 'free_number') {
    freeNumberFieldRef.value?.focus()
  }
}
const cancelEditing = () => {
  initializeEditingAnswer()
  isEditing.value = false
}

const updateAnswer = () => {
  if (editingAnswer.value === undefined) return
  const updatedAnswer: components['schemas']['AnswerRequest'] | undefined = (() => {
    if (editingAnswer.value === undefined) return
    if (isEmptyAnswer.value) return
    switch (editingAnswer.value.type) {
      case 'free_text':
        return {
          type: editingAnswer.value.type,
          questionId: props.question.id,
          content: editingAnswer.value.content!,
        }
      case 'free_number':
        return {
          type: editingAnswer.value.type,
          questionId: props.question.id,
          content: editingAnswer.value.content!,
        }
      case 'single':
        return {
          type: editingAnswer.value.type,
          questionId: props.question.id,
          optionId: editingAnswer.value.optionId!,
        }
      case 'multiple':
        return {
          type: editingAnswer.value.type,
          questionId: props.question.id,
          optionIds: editingAnswer.value.optionIds!,
        }
      default:
        const _exhaustiveCheck: never = editingAnswer.value
        throw new Error(`Unexpected type: ${(_exhaustiveCheck as EditingAnswer).type}`)
    }
  })()
  if (!updatedAnswer) return
  emit('update', props.answer?.id, updatedAnswer)
  initializeEditingAnswer()
  isEditing.value = false
}

// userId, answerが変わったときに編集状態をリセット
watch([() => props.userId, () => props.answer], cancelEditing, { immediate: true })
</script>

<template>
  <answer-card-base
    :question-title="props.question.title"
    :user-id="props.userId"
    :answer-exists="props.answer !== undefined"
    :is-editing="isEditing"
    :is-empty-answer="isEmptyAnswer"
    @edit="startEditing"
    @cancel="cancelEditing"
    @save="updateAnswer"
  >
    <v-text-field
      v-if="editingAnswer?.type === 'free_text'"
      ref="freeTextFieldRef"
      v-model="editingAnswer.content"
      :class="{ 'disabled-field': !isEditing }"
      class="mb-2"
      label="自由記述"
      hide-details
    />
    <v-number-input
      v-if="editingAnswer?.type === 'free_number'"
      ref="freeNumberFieldRef"
      v-model="editingAnswer.content"
      :class="{ 'disabled-field': !isEditing }"
      class="mb-2"
      type="number"
      label="数値入力"
      control-variant="hidden"
      hide-details
    />
    <v-radio-group
      v-if="editingAnswer?.type === 'single' && props.question.type === 'single'"
      v-model="editingAnswer.optionId"
      hide-details
    >
      <v-radio
        v-for="option in props.question.options"
        :key="option.id"
        :class="{ 'disabled-field': !isEditing }"
        :label="option.content"
        :value="option.id"
      />
    </v-radio-group>
    <div v-if="editingAnswer?.type === 'multiple' && props.question.type === 'multiple'">
      <v-checkbox
        v-for="option in props.question.options"
        :key="option.id"
        v-model="editingAnswer.optionIds"
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
