<script setup lang="ts">
import QuestionGroupSummaryEditor from '@/components/QuestionsEdit/QuestionGroupSummaryEditor.vue'
import QuestionEditor from '@/components/QuestionsEdit/QuestionEditor.vue'
import QuestionGroupEditorActions from '@/components/QuestionsEdit/QuestionGroupEditorActions.vue'
import { ref, watch, toRaw } from 'vue'
import type { components } from '@/api/schema'
import { generateNewTemporaryId, isTemporaryId } from '@/utils/temporaryIdManager'

type QuestionGroup = components['schemas']['QuestionGroupResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroup: QuestionGroup): void
}>()

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
      :is-new-question-group="isTemporaryId(editingQuestionGroup.id)"
      @create="editingQuestionGroup.questions.push(generateQuestion())"
      @cancel="emit('cancel')"
      @delete="emit('delete', questionGroup.id)"
      @save="emit('update', editingQuestionGroup)"
    />
  </v-sheet>
</template>
