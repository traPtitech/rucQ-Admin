<script setup lang="ts">
import type { NavItem } from '@/layouts/CampPageLayout.vue'

defineProps<{
  navs: NavItem[]
}>()
</script>

<template>
  <v-bottom-navigation>
    <v-btn v-for="nav in navs" :key="nav.title" :to="nav.to" :value="nav.value" exact>
      <v-icon>{{ nav.icon }}</v-icon>
      <span>{{ nav.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>
