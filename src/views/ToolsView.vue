<script setup lang="ts">
import ContentCard from '@/components/shared/ContentCard.vue'
import { useRoute, type RouteLocationAsRelativeGeneric } from 'vue-router'

interface Tool {
  title: string
  icon: string
  to: RouteLocationAsRelativeGeneric
}

const route = useRoute()
const campname = route.params.campname as string

const tools: Tool[] = [
  {
    title: 'トップ',
    icon: 'mdi-home',
    to: { name: 'Top' },
  },
  {
    title: '質問',
    icon: 'mdi-file-question',
    to: { name: 'QuestionsEdit', params: { campname } },
  },
  {
    title: 'イベント',
    icon: 'mdi-calendar',
    to: { name: 'Events', params: { campname } },
  },
  {
    title: '部屋',
    icon: 'mdi-door',
    to: { name: 'Rooms', params: { campname } },
  },
  {
    title: '点呼',
    icon: 'mdi-account-check',
    to: { name: 'RollCallList', params: { campname } },
  },
  {
    title: '支払い',
    icon: 'mdi-cash',
    to: { name: 'Payments', params: { campname } },
  },
]
</script>

<template>
  <v-container>
    <v-row class="pa-3">
      <v-col v-for="tool in tools" :key="tool.title" cols="6" md="4">
        <ContentCard :to="tool.to">
          <div class="d-flex flex-column align-center ga-1 pa-3">
            <v-icon size="40" :icon="tool.icon" />
            <span class="text-h5">{{ tool.title }}</span>
          </div>
        </ContentCard>
      </v-col>
    </v-row>
  </v-container>
</template>
