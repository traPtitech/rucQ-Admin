<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { components } from '@/api/schema'
import { convertMarkdownToSafeHtml } from '@/utils/markdownConverter'

defineProps<{
  camp?: components['schemas']['CampResponse']
}>()

const route = useRoute()
const campname = route.params.campname as string
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <h2 class="font-weight-regular">合宿のしおり</h2>
      <v-spacer />
      <v-btn
        v-if="camp"
        class="mr-2"
        icon="mdi-pencil"
        size="medium"
        variant="plain"
        :to="{ name: 'GuidebookEdit', params: { campname: campname } }"
      />
    </div>
    <v-sheet v-if="!!camp?.guidebook" class="pa-4" elevation="2">
      <div v-html="convertMarkdownToSafeHtml(camp.guidebook)" class="markdown-body pa-4"></div>
    </v-sheet>
    <v-sheet v-else-if="camp" class="pa-4" elevation="2">
      <p class="text-medium-emphasis">合宿のしおりはまだ作成されていません</p>
    </v-sheet>
    <v-sheet v-else class="pa-4" elevation="2">
      <p class="text-medium-emphasis">合宿の取得に失敗しました</p>
    </v-sheet>
  </div>
</template>
