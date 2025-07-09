<script setup lang="ts">
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

defineProps<{
  guidebook?: string
}>()

const sanitizedHtml = (markdown: string) => {
  const html = marked.parse(markdown, { gfm: true, breaks: true }) as string
  return sanitizeHtml(html, {
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      th: ['align'],
      td: ['align'],
    },
  })
}
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <h2 class="font-weight-regular">合宿のしおり</h2>
      <v-spacer />
      <v-btn class="mr-2" icon="mdi-pencil" size="medium" variant="plain" />
    </div>
    <v-sheet v-if="!!guidebook" elevation="2" class="pa-4">
      <div v-html="sanitizedHtml(guidebook)" class="markdown-body pa-4"></div>
    </v-sheet>
    <v-sheet v-else elevation="2" class="pa-4">
      <p class="text-medium-emphasis">合宿のしおりはまだ作成されていません。</p>
    </v-sheet>
  </div>
</template>
