<script setup lang="ts">
import { computed } from 'vue'

const { elevation = 2 } = defineProps<{
  elevation?: number | string
}>()

const elevationValue = computed(() => {
  return typeof elevation === 'number' ? elevation : parseInt(elevation, 10)
})
</script>

<template>
  <v-sheet class="pa-4 mb-6" :elevation="elevationValue">
    <slot />
  </v-sheet>
</template>
