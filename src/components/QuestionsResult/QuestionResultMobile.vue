<script setup lang="ts">
import { computed, ref } from 'vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'
import UsersCopyButton from '@/components/QuestionsResult/UsersCopyButton.vue'
import {
  groupAnswers,
  groupUnansweredUsers,
  answerContent,
  groupKey,
} from '@/components/QuestionsResult/group-answers'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type Answer = components['schemas']['AnswerResponse']
type User = components['schemas']['UserResponse']

const props = defineProps<{
  question: Question
  answers: Answer[]
  participants: User[]
}>()

const isModalOpen = ref(false)
const groupedAnswers = computed(() =>
  groupAnswers(props.question, props.answers, props.participants),
)
const unansweredUsers = computed(() =>
  groupUnansweredUsers(props.question, props.answers, props.participants).map((u) => u.id),
)
</script>

<template>
  <content-card @click="isModalOpen = true">
    <h3>{{ props.question.title }}</h3>
    <v-table>
      <tbody>
        <tr v-for="group in groupedAnswers" :key="groupKey(group)">
          <td v-if="answerContent(group)" class="text-subtitle-1">{{ answerContent(group) }}</td>
          <td v-else class="text-subtitle-2 text-medium-emphasis">(回答なし)</td>
          <td class="text-body-1 text-right" width="40px">{{ group.users.length }}</td>
        </tr>
        <tr>
          <td class="text-subtitle-2 text-medium-emphasis">(未回答)</td>
          <td class="text-body-1 text-right" width="40px">{{ unansweredUsers.length }}</td>
        </tr>
      </tbody>
    </v-table>
  </content-card>
  <v-dialog v-model="isModalOpen" max-width="600" max-height="85vh">
    <v-card :title="question.title" class="pb-2">
      <div v-for="group in groupedAnswers" :key="groupKey(group)" class="px-6 mb-4">
        <div class="d-flex align-center">
          <div v-if="answerContent(group)" class="text-subtitle-1">{{ answerContent(group) }}</div>
          <div v-else class="text-subtitle-2 text-medium-emphasis">(回答なし)</div>
          <v-spacer />
          <div class="text-body-2 text-right">{{ group.users.length }}</div>
          <users-copy-button :users="group.users" />
        </div>
        <v-divider class="mb-1" />
        <user-avatar-list :users="group.users" size="x-small" />
      </div>
      <div class="px-6 mb-4">
        <div class="d-flex align-center">
          <div class="text-subtitle-2 text-medium-emphasis">(未回答)</div>
          <v-spacer />
          <div class="text-body-2 text-right">{{ unansweredUsers.length }}</div>
          <users-copy-button :users="unansweredUsers" />
        </div>
        <v-divider class="mb-1" />
        <user-avatar-list :users="unansweredUsers" size="x-small" />
      </div>
    </v-card>
  </v-dialog>
</template>
