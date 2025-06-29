<script setup lang="ts">
import QuestionItemEditor from '@/components/QuestionsEdit/QuestionEditor.vue'
import { ref, watch, toRaw } from 'vue'
import type { components } from '@/api/schema'
import { generateNewTemporaryId, isAssignedId } from '@/utils/temporaryIdManager'

type QuestionGroup = components['schemas']['QuestionGroupResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroupId: number, questionGroup: QuestionGroup): void
}>()

const generateQuestion = (): components['schemas']['QuestionResponse'] => ({
  id: generateNewTemporaryId(),
  questionGroupId: props.questionGroup.id,
  title: '',
  type: 'free_text',
  description: '',
  isPublic: true,
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
  <v-sheet elevation="4" class="d-flex flex-column ga-2 pa-4">
    <div>
      <v-text-field
        v-model="editingQuestionGroup.name"
        class="title-input pa-0"
        placeholder="質問グループ名"
        variant="underlined"
        density="compact"
        hide-details
      />
      <v-textarea
        v-model="editingQuestionGroup.description"
        placeholder="説明"
        variant="underlined"
        rows="1"
        auto-grow
        hide-details
      />
    </div>
    <div class="d-flex flex-column ga-2">
      <question-item-editor
        v-for="(question, index) in editingQuestionGroup.questions"
        :key="question.id"
        v-model="editingQuestionGroup.questions[index]"
      />
    </div>
    <div class="d-flex justify-space-between align-center mt-2">
      <v-btn
        prepend-icon="mdi-plus"
        variant="outlined"
        @click="editingQuestionGroup.questions.push(generateQuestion())"
      >
        質問を追加
      </v-btn>
      <div class="d-flex ga-2 align-self-end">
        <v-btn color="secondary" @click="emit('cancel')"> キャンセル </v-btn>
        <v-btn
          v-if="isAssignedId(questionGroup.id)"
          color="error"
          @click="emit('delete', questionGroup.id)"
        >
          削除
        </v-btn>
        <v-btn color="primary" @click="emit('update', questionGroup.id, editingQuestionGroup)">
          保存
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
