<script setup lang="ts">
import UsersCopyButton from '@/components/QuestionsResult/UsersCopyButton.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'
import {
  answerContent,
  groupKey,
  type GroupedAnswer,
} from '@/components/QuestionsResult/group-answers'

defineProps<{
  questionTitle: string
  groupedAnswers: GroupedAnswer[]
  unansweredUsers: string[]
}>()

const isModalOpen = defineModel<boolean>({ required: true })
</script>

<template>
  <v-table>
    <tbody>
      <tr v-for="group in groupedAnswers" :key="groupKey(group)" class="px-10">
        <td v-if="answerContent(group)" class="text-subtitle-1">{{ answerContent(group) }}</td>
        <td v-else class="text-subtitle-2 text-medium-emphasis">(回答なし)</td>
        <td class="text-body-1 text-right" width="40px">{{ group.users.length }}</td>
      </tr>
      <tr class="px-10">
        <td class="text-subtitle-2 text-medium-emphasis">(未回答)</td>
        <td class="text-body-1 text-right" width="40px">{{ unansweredUsers.length }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-dialog v-model="isModalOpen" max-width="600" max-height="85vh">
    <v-card :title="questionTitle" class="pb-2">
      <div v-for="group in groupedAnswers" :key="groupKey(group)" class="px-6 mb-4">
        <div class="d-flex align-center">
          <div v-if="answerContent(group)" class="text-subtitle-1">{{ answerContent(group) }}</div>
          <div v-else class="text-subtitle-2 text-medium-emphasis">(回答なし)</div>
          <v-spacer />
          <div class="text-body-2 text-right">{{ group.users.length }}</div>
          <users-copy-button />
        </div>
        <v-divider class="mb-1" />
        <user-avatar-list :users="group.users" size="x-small" />
      </div>
      <div class="px-6 mb-4">
        <div class="d-flex align-center">
          <div class="text-subtitle-2 text-medium-emphasis">(未回答)</div>
          <v-spacer />
          <div class="text-body-2 text-right">{{ unansweredUsers.length }}</div>
          <users-copy-button />
        </div>
        <v-divider class="mb-1" />
        <user-avatar-list :users="unansweredUsers" size="x-small" />
      </div>
    </v-card>
  </v-dialog>
</template>
