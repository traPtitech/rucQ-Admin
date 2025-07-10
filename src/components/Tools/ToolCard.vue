<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric } from 'vue-router'
defineProps<{
  title: string
  icon: string
  to: RouteLocationAsRelativeGeneric
}>()
</script>

<template>
  <v-card class="d-flex flex-column align-center ga-1 pa-4" elevation="2" rounded="0" :to="to">
    <v-icon size="48" :icon="icon" />
    <h3 class="text-h6">{{ title }}</h3>
  </v-card>
</template>
