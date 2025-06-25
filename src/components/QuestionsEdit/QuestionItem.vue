<script setup lang="ts">
import type { components } from '@/api/schema'

defineProps<{
  question: components['schemas']['QuestionResponse']
}>()
</script>

<template>
  <v-sheet elevation="2" rounded class="px-4 py-2">
    <div class="d-flex align-center justify-space-between ga-2">
      <div class="d-flex align-end ga-1">
        <h3>{{ question.title }}</h3>
        <span class="text-body-2 text-medium-emphasis">{{ question.description }}</span>
      </div>
      <div>
        <v-icon v-if="question.isPublic" size="small">mdi-web</v-icon>
        <v-icon v-else size="small">mdi-lock</v-icon>
        <v-icon v-if="question.isOpen" size="small">mdi-content-save</v-icon>
        <v-icon v-else size="small">mdi-content-save-off</v-icon>
      </div>
    </div>
    <template v-if="question.type === 'free_text'">
      <v-text-field class="disabled-field" label="自由記述" hide-details />
    </template>
    <template v-if="question.type === 'free_number'">
      <v-text-field class="disabled-field" label="数値入力" hide-details />
    </template>
    <template v-if="question.type === 'single'">
      <v-radio-group hide-details>
        <v-radio
          v-for="option in question.options"
          :key="option.id"
          class="disabled-field"
          :label="option.content"
        />
      </v-radio-group>
    </template>
    <template v-if="question.type === 'multiple'">
      <div>
        <v-checkbox
          v-for="option in question.options"
          :key="option.id"
          class="disabled-field"
          :label="option.content"
          density="compact"
          hide-details
        />
      </div>
    </template>
  </v-sheet>
</template>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
