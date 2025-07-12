<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import type { components } from '@/api/schema'
import { convertMarkdownToSafeHtml } from '@/utils/markdownConverter'

defineProps<{
  camp?: components['schemas']['CampResponse']
}>()

const route = useRoute()
const router = useRouter()
const campname = route.params.campname as string
</script>

<template>
  <div v-if="!!camp?.guidebook">
    <section-title
      title="合宿のしおり"
      action-icon="mdi-pencil"
      @action="router.push({ name: 'GuidebookEdit', params: { campname: campname } })"
    />
    <section-card>
      <div v-html="convertMarkdownToSafeHtml(camp.guidebook)" class="markdown-body"></div>
    </section-card>
  </div>
  <div v-else-if="camp">
    <section-title
      title="合宿のしおり"
      action-icon="mdi-pencil"
      @action="router.push({ name: 'GuidebookEdit', params: { campname: campname } })"
    />
    <section-card>
      <p class="text-medium-emphasis">合宿のしおりはまだ作成されていません</p>
    </section-card>
  </div>
  <div v-else>
    <section-title title="合宿のしおり" />
    <section-card>
      <p class="text-medium-emphasis">合宿の取得に失敗しました</p>
    </section-card>
  </div>
</template>
