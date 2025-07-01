<script setup lang="ts">
import QuestionGroupItem from '@/components/QuestionsEdit/QuestionGroupItem.vue'
import QuestionGroupEditor from './QuestionGroupEditor.vue'
import { ref } from 'vue'
import type { components } from '@/api/schema'

type QuestionGroupResponse = components['schemas']['QuestionGroupResponse']

defineProps<{
  questionGroup: QuestionGroupResponse
}>()

const emit = defineEmits<{
  (e: 'delete', questionGroupId: number): void
  (e: 'update', questionGroup: QuestionGroupResponse): void
}>()

const editMode = ref(false)
</script>

<template>
  <question-group-item v-if="!editMode" :question-group="questionGroup" @edit="editMode = true" />
  <question-group-editor
    v-else
    :question-group="questionGroup"
    @cancel="editMode = false"
    @delete="emit('delete', questionGroup.id)"
    @update="(qg) => emit('update', qg)"
  />
</template>
