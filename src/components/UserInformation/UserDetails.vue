<script setup lang="ts">
import SectionTitle from '@/components/shared/SectionTitle.vue'
import AnswerGroupCard from '@/components/UserInformation/AnswerGroupCard.vue'
import DeleteRegistrationButton from '@/components/UserInformation/DeleteRegistrationButton.vue'
import { useQuestionGroupsQuery } from '@/api/queries/questions'

defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  (e: 'deleteRegistration', userId: string): void
}>()

const { data: questionGroups } = useQuestionGroupsQuery()
</script>

<template>
  <div>
    <div v-for="questionGroup in questionGroups" :key="questionGroup.id">
      <section-title :title="questionGroup.name" />
      <answer-group-card :user-id="userId" :question-group="questionGroup" />
    </div>
    <div class="d-flex justify-center">
      <delete-registration-button :user-id="userId" @delete="emit('deleteRegistration', userId)" />
    </div>
  </div>
</template>
