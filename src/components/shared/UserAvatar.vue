<script lang="ts" setup>
const { size = 'small' } = defineProps<{
  trapId?: string
  size?: number | 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()

const avatarUrl = (id: string | undefined) => {
  return `https://q.trap.jp/api/v3/public/icon/${id ?? 'traP'}`
}
</script>

<template>
  <v-avatar :size="size">
    <v-img :src="avatarUrl(trapId)" :alt="trapId ?? 'undefined'">
      <template #error>
        <v-img :src="avatarUrl('traP')" alt="unknown" />
      </template>
    </v-img>
  </v-avatar>
</template>
