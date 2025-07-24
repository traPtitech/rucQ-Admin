<script setup lang="ts">
import UsersCopyButton from '@/components/QuestionsResult/UsersCopyButton.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'
import {
  answerContent,
  groupKey,
  type GroupedAnswer,
} from '@/components/QuestionsResult/group-answers'

defineProps<{
  groupedAnswers: GroupedAnswer[]
  unansweredUsers: string[]
}>()
</script>

<template>
  <v-table>
    <tbody>
      <tr v-for="group in groupedAnswers" :key="groupKey(group)" class="px-10">
        <td v-if="answerContent(group)" class="text-body-1 px-2">{{ answerContent(group) }}</td>
        <td v-else class="text-body-2 text-medium-emphasis px-2">(回答なし)</td>
        <td class="text-body-1 text-right px-2" width="40px">{{ group.users.length }}</td>
        <td class="pr-0 px-2" width="328px">
          <user-avatar-list :users="group.users" />
        </td>
        <td class="w-0 px-2">
          <users-copy-button />
        </td>
      </tr>
      <tr class="px-10">
        <td class="text-body-2 text-medium-emphasis px-2">(未回答)</td>
        <td class="text-body-1 text-right px-2" width="40px">{{ unansweredUsers.length }}</td>
        <td class="pr-0 px-2" width="328px">
          <user-avatar-list :users="unansweredUsers" />
        </td>
        <td class="w-0 px-2">
          <users-copy-button />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
