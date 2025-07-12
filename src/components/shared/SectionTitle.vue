<script setup lang="ts">
defineProps<{
  title: string
  actionIcon?: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div v-if="title" class="d-flex align-center">
    <h2 class="font-weight-regular">
      <slot>{{ title }}</slot>
    </h2>
    <v-spacer />
    <slot name="actions">
      <v-btn
        v-if="actionIcon"
        class="mr-2"
        :icon="actionIcon"
        size="medium"
        variant="plain"
        @click="emit('action')"
      />
    </slot>
  </div>
</template>
