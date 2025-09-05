<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import type { RouteLocationAsRelativeGeneric } from 'vue-router'

const { borderColor = 'primary', elevation = 2 } = defineProps<{
  title?: string
  actionIcon?: string
  borderColor?: string
  elevation?: number | string
  to?: RouteLocationAsRelativeGeneric
}>()

const emit = defineEmits<{
  (e: 'action'): void
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
  <v-card class="content-card px-4 py-2 my-2" :to="to" :elevation="elevationValue" rounded>
    <div v-if="title" class="d-flex align-center">
      <span class="text-h6">{{ title }}</span>
      <v-spacer />
      <slot name="actions">
        <v-btn
          v-if="actionIcon"
          :icon="actionIcon"
          size="small"
          variant="plain"
          @click.stop="emit('action')"
        />
      </slot>
    </div>
    <slot />
  </v-card>
</template>

<style scoped>
.content-card {
  border-left: 4px solid v-bind(borderColorValue);
}
</style>
