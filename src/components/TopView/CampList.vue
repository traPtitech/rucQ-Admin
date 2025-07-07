<script setup lang="ts">
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
const { title, camps } = defineProps<{
  title: string
  camps: Camp[]
}>()
</script>
<template>
  <v-card class="mb-4">
    <h3 class="pl-4">{{ title }}</h3>
    <v-card v-for="camp in camps" :key="camp.id" class="ma-4">
      <v-card-title>{{ camp.name }}</v-card-title>
      <v-card-subtitle>{{ camp.dateStart }} 〜 {{ camp.dateEnd }}</v-card-subtitle>
      <v-card-text>{{ camp.description }}</v-card-text>
      <v-card-actions>
        <v-btn color="primary" :to="`/${camp.displayId}`">詳細</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>
