<script setup lang="ts">
import ContentCard from '@/components/shared/ContentCard.vue'
import UsersCopyButton from '@/components/shared/UsersCopyButton.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'

defineProps<{
  content?: string
  userIds: string[]
}>()
</script>

<template>
  <content-card :title="content ?? '未回答'">
    <template #actions>
      <users-copy-button :users="userIds" />
    </template>
    <user-avatar-list v-if="userIds.length" :users="userIds" show-count />
    <div v-else-if="content" class="text-medium-emphasis pa-1">回答者がいません</div>
    <div v-else class="text-medium-emphasis pa-1">未回答者はいません</div>
  </content-card>
</template>
