<script setup lang="ts">
import type { NavItem } from '@/components/layout/CampPageLayout.vue'

defineProps<{
  navs: NavItem[]
}>()
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list-item
      v-for="nav in navs"
      :key="nav.title"
      :prepend-icon="nav.icon"
      :title="nav.title"
      :to="nav.to"
      exact
    />
  </v-navigation-drawer>
</template>
