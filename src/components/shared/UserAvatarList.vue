<script setup lang="ts">
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useRoute } from 'vue-router'

const { size = 'small' } = defineProps<{
  users: string[]
  size?: number | 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()

const route = useRoute()
const campname = route.params.campname as string
</script>

<template>
  <div class="flex flex-wrap">
    <span v-for="userId in users" :key="userId">
      <router-link
        :to="{
          name: 'UserInformation',
          params: { campname: campname },
          query: { id: userId },
        }"
      >
        <user-avatar :user-id="userId" :size="size" />
      </router-link>
    </span>
  </div>
</template>
