<script setup lang="ts">
import QuestionGroupCard from '@/components/QuestionsResult/QuestionGroupCard.vue'
import { useParticipantsQuery } from '@/api/queries/participants'
import { useQuestionGroupsQuery } from '@/api/queries/questions'

const { data: participants } = useParticipantsQuery()
const { data: questionGroups } = useQuestionGroupsQuery()
</script>

<template>
  <v-container v-if="participants !== undefined && questionGroups !== undefined" max-width="1200">
    <question-group-card
      v-for="questionGroup in questionGroups"
      :key="questionGroup.id"
      :question-group="questionGroup"
      :participants="participants"
    />
  </v-container>
</template>
