<script setup lang="ts">
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import type { components } from '@/api/schema'
import { useRoute } from 'vue-router'
type RollCall = components['schemas']['RollCallResponse']

const route = useRoute()
const campname = route.params.campname as string
defineProps<{
  rollCalls: RollCall[]
}>()
</script>

<template>
  <section-title title="点呼一覧" />
  <section-card>
    <content-card
      v-for="rollCall in rollCalls"
      :key="rollCall.id"
      :title="rollCall.name"
      :to="{ name: 'RollCall', params: { campname, rollcallid: rollCall.id } }"
    >
      <div class="text-body-1 mb-2">{{ rollCall.description }}</div>
      <div class="text-body-2">対象者: {{ rollCall.subjects.length }}名</div>
    </content-card>
  </section-card>
</template>
