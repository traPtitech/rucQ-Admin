<script setup lang="ts">
import type { components } from '@/api/schema'

defineProps<{
  question: components['schemas']['QuestionResponse']
}>()
</script>

<template>
  <v-sheet elevation="2" rounded class="question-sheet px-4 py-2">
    <div class="d-flex align-start justify-space-between">
      <div class="d-flex flex-column flex-sm-row align-sm-end">
        <h3 class="mr-1">{{ question.title }}</h3>
        <span class="text-body-2 text-medium-emphasis">{{ question.description }}</span>
      </div>
      <div class="d-flex ga-1 py-1">
        <v-chip v-if="question.isPublic" variant="outlined" color="blue" size="small">
          public
        </v-chip>
        <v-chip v-else variant="outlined" color="brown" size="small"> private </v-chip>
        <v-chip v-if="question.isOpen" variant="outlined" color="green" size="small"> open </v-chip>
        <v-chip v-else variant="outlined" color="red" size="small"> closed </v-chip>
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
.question-sheet {
  border-left: 4px solid rgb(var(--v-theme-primary));
}
.disabled-field {
  pointer-events: none;
}
</style>
