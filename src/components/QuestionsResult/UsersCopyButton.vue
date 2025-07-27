<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  users: string[]
}>()

const TOOLTIP_DISPLAY_DURATION_MS = 1000
const copyIcon = ref('mdi-content-copy')
const isTooltipOpen = ref(false)
const copyTimeoutId = ref<ReturnType<typeof setTimeout> | undefined>(undefined)

// ['user1', 'user2'] -> '@user1 @user2 '
const usersString = computed(() => {
  return props.users.map((user) => `@${user} `).join('')
})

const copyToClipboard = async () => {
  if (!navigator.clipboard) {
    alert('このブラウザではクリップボード機能が利用できません。')
    return
  }
  if (copyTimeoutId.value) {
    clearTimeout(copyTimeoutId.value)
  }
  try {
    await navigator.clipboard.writeText(usersString.value)
    copyIcon.value = 'mdi-check'
    isTooltipOpen.value = true
    copyTimeoutId.value = setTimeout(() => {
      copyIcon.value = 'mdi-content-copy'
      isTooltipOpen.value = false
    }, TOOLTIP_DISPLAY_DURATION_MS)
  } catch (err) {
    console.error('クリップボードへのコピーに失敗しました:', err)
    alert('クリップボードへのコピーに失敗しました。')
    copyIcon.value = 'mdi-content-copy'
  }
}
</script>

<template>
  <v-tooltip v-model="isTooltipOpen" location="top" :open-on-hover="false">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :icon="copyIcon"
        size="small"
        density="comfortable"
        variant="plain"
        @click="copyToClipboard"
      />
    </template>
    <span class="text-caption">copied!</span>
  </v-tooltip>
</template>
