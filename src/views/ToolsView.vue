<script setup lang="ts">
import ToolCard from '@/components/Tools/ToolCard.vue'
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
    title: '質問編集',
    icon: 'mdi-file-question',
    to: { name: 'QuestionsEdit', params: { campname } },
  },
  {
    title: '部屋情報',
    icon: 'mdi-door',
    to: { name: 'Rooms', params: { campname } },
  },
  {
    title: '点呼',
    icon: 'mdi-account-check',
    to: { name: 'RollCallList', params: { campname } },
  },
  {
    title: '支払い情報',
    icon: 'mdi-cash',
    to: { name: 'Payments', params: { campname } },
  },
]
</script>

<template>
  <v-container>
    <v-row class="pa-3">
      <v-col v-for="tool in tools" :key="tool.title" cols="6" md="4">
        <ToolCard :title="tool.title" :icon="tool.icon" :to="tool.to" />
      </v-col>
    </v-row>
  </v-container>
</template>
