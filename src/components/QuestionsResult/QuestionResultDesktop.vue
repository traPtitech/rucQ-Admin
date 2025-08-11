<script setup lang="ts">
import { computed } from 'vue'
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

const props = defineProps<{
  question: Question
  answers: Answer[]
  participants: string[]
}>()

const groupedAnswers = computed(() =>
  groupAnswers(props.question, props.answers, props.participants),
)
const unansweredUsers = computed(() =>
  groupUnansweredUsers(props.question, props.answers, props.participants),
)
</script>

<template>
  <content-card>
    <h3 class="py-2">{{ props.question.title }}</h3>
    <v-divider />
    <v-table>
      <tbody>
        <tr v-for="group in groupedAnswers" :key="groupKey(group)">
          <td v-if="answerContent(group)" class="text-body-1 px-2" width="40%">
            {{ answerContent(group) }}
          </td>
          <td v-else class="text-body-2 text-medium-emphasis px-2" width="40%">(回答なし)</td>
          <td class="text-body-1 text-right px-2" width="40px">{{ group.users.length }}</td>
          <td class="px-0 ml-2">
            <user-avatar-list :users="group.users" size="x-small" />
          </td>
          <td class="w-0 px-2">
            <users-copy-button :users="group.users" />
          </td>
        </tr>
        <tr>
          <td class="text-body-2 text-medium-emphasis px-2">(未回答)</td>
          <td class="text-body-1 text-right px-2" width="40px">{{ unansweredUsers.length }}</td>
          <td class="px-0 ml-2">
            <user-avatar-list :users="unansweredUsers" size="x-small" />
          </td>
          <td class="w-0 px-2">
            <users-copy-button :users="unansweredUsers" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </content-card>
</template>
