<script setup lang="ts">
import { ref } from 'vue'
import QuestionGroupItem from '@/components/QuestionsEdit/QuestionGroupItem.vue'
import QuestionGroupEditor from './QuestionGroupEditor.vue'
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']

defineProps<{
  questionGroup: QuestionGroup
}>()

const emit = defineEmits<{
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroup: QuestionGroup): void
}>()

const editMode = ref(false)

const handleDelete = (questionGroupId: number) => {
  emit('delete', questionGroupId)
  editMode.value = false
}
const handleUpdate = (questionGroup: QuestionGroup) => {
  emit('update', questionGroup)
  editMode.value = false
}
</script>

<template>
  <question-group-item v-if="!editMode" :question-group="questionGroup" @edit="editMode = true" />
  <question-group-editor
    v-else
    :question-group="questionGroup"
    @cancel="editMode = false"
    @delete="handleDelete(questionGroup.id)"
    @update="handleUpdate"
  />
</template>
