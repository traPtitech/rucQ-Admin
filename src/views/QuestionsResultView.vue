<script setup lang="ts">
import { computed } from 'vue'
import QuestionGroupCard from '@/components/QuestionsResult/QuestionGroupCard.vue'
import { useParticipantsQuery } from '@/api/queries/participants'
import { useQuestionGroupsQuery } from '@/api/queries/questions'

const { data: participants } = useParticipantsQuery()
const { data: questionGroups } = useQuestionGroupsQuery()

const participantIds = computed(() => participants.value?.map((p) => p.id))
</script>

<template>
  <v-container v-if="participantIds !== undefined && questionGroups !== undefined" max-width="1200">
    <question-group-card
      v-for="questionGroup in questionGroups"
      :key="questionGroup.id"
      :question-group="questionGroup"
      :participants="participantIds"
    />
  </v-container>
</template>
