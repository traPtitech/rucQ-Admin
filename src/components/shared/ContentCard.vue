<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'

const { borderColor = 'primary', elevation = 2 } = defineProps<{
  borderColor?: string
  elevation?: number | string
  to?: RouteLocationAsRelativeGeneric
}>()

const theme = useTheme()
const borderColorValue = computed(() => {
  return theme.current.value.colors[borderColor] || borderColor
})

const elevationValue = computed(() => {
  return typeof elevation === 'number' ? elevation : parseInt(elevation, 10)
})
</script>

<template>
  <v-card class="question-sheet px-4 py-2 my-2" :to="to" :elevation="elevationValue" rounded>
    <slot />
  </v-card>
</template>

<style scoped>
.question-sheet {
  border-left: 4px solid v-bind(borderColorValue);
}
</style>
