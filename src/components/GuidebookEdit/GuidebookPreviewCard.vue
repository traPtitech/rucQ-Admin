<script setup lang="ts">
import { convertMarkdownToSafeHtml } from '@/utils/markdownConverter'

defineProps<{
  guidebook: string
}>()
</script>

<template>
  <v-sheet v-if="!!guidebook" class="pa-4" elevation="2">
    <div v-html="convertMarkdownToSafeHtml(guidebook)" class="markdown-body pa-4"></div>
  </v-sheet>
  <v-sheet v-else class="pa-4" elevation="2">
    <p class="text-medium-emphasis">合宿のしおりはまだ作成されていません</p>
  </v-sheet>
</template>
