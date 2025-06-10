<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title || 'Unknown Page')
</script>

<template>
  <v-app-bar scroll-behavior="hide">
    <v-app-bar-title>{{ title }}</v-app-bar-title>
  </v-app-bar>
</template>
