<script setup lang="ts">
import { ref, watch, toRaw } from 'vue'
import type { VForm } from 'vuetify/components'
import QuestionGroupSummaryEditor from '@/components/QuestionsEdit/QuestionGroupSummaryEditor.vue'
import QuestionEditor from '@/components/QuestionsEdit/QuestionEditor.vue'
import QuestionGroupEditorActions from '@/components/QuestionsEdit/QuestionGroupEditorActions.vue'
import { generateNewTemporaryId, isTemporaryId } from '@/utils/temporaryIdManager'
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroup: QuestionGroup): void
}>()

const formRef = ref<VForm | null>(null)
const isSaveModalOpen = ref(false)
const isErrorModalOpen = ref(false)

const validateAndOpenModal = async () => {
  const hasQuestions = editingQuestionGroup.value.questions.length > 0
  const hasOptions = editingQuestionGroup.value.questions.every(
    (q) => !('options' in q) || q.options.length > 0,
  )
  const isValid = (await formRef.value?.validate())?.valid ?? false
  if (isValid && hasQuestions && hasOptions) isSaveModalOpen.value = true
  else isErrorModalOpen.value = true
}

const generateQuestion = (): components['schemas']['QuestionResponse'] => ({
  id: generateNewTemporaryId(),
  questionGroupId: props.questionGroup.id,
  title: '',
  type: 'free_text',
  description: '',
  isPublic: false,
  isOpen: true,
})

// ディープコピーして編集用のオブジェクトを作成
const editingQuestionGroup = ref<QuestionGroup>(structuredClone(toRaw(props.questionGroup)))

// 予期しない変更があった場合に編集モードを終了
watch(
  () => props.questionGroup,
  () => emit('cancel'),
  { deep: true },
)
</script>

<template>
  <v-form ref="formRef">
    <v-sheet elevation="4" class="d-flex flex-column ga-4 pa-4 pt-6">
      <question-group-summary-editor v-model="editingQuestionGroup" />
      <div class="d-flex flex-column ga-4">
        <question-editor
          v-for="(question, index) in editingQuestionGroup.questions"
          :key="question.id"
          v-model="editingQuestionGroup.questions[index]"
          @delete="editingQuestionGroup.questions.splice(index, 1)"
        />
      </div>
      <question-group-editor-actions
        v-model:is-save-modal-open="isSaveModalOpen"
        v-model:is-error-modal-open="isErrorModalOpen"
        :is-new-question-group="isTemporaryId(editingQuestionGroup.id)"
        @create="editingQuestionGroup.questions.push(generateQuestion())"
        @cancel="emit('cancel')"
        @delete="emit('delete', questionGroup.id)"
        @validate="validateAndOpenModal"
        @save="emit('update', editingQuestionGroup)"
      />
    </v-sheet>
  </v-form>
</template>
