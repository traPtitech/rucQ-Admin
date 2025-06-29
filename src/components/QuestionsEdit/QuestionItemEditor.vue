<script setup lang="ts">
import type { components } from '@/api/schema'

const question = defineModel<components['schemas']['QuestionRequest']>({ required: true })

const removeOption = (optionId?: number) => {
  if (optionId == undefined) return
  if ('options' in question.value) {
    question.value.options = question.value.options.filter((option) => option.id !== optionId)
    console.log('Option removed:', optionId)
  }
}
</script>

<template>
  <v-sheet elevation="2" rounded class="pa-4">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="question.title" placeholder="質問" hide-details />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="question.description" placeholder="説明" hide-details />
      </v-col>
    </v-row>
    <template v-if="question.type === 'free_text'">
      <v-text-field class="py-4 disabled-field" label="自由記述" hide-details />
    </template>
    <template v-if="question.type === 'free_number'">
      <v-text-field class="py-4 disabled-field" label="数値入力" hide-details />
    </template>
    <template v-if="question.type === 'single'">
      <div class="pa-2">
        <v-text-field
          v-for="option in question.options"
          :key="option.id"
          v-model="option.content"
          variant="underlined"
          hide-details
        >
          <template #prepend>
            <v-radio class="disabled-field" density="compact" hide-details />
          </template>
          <template #append>
            <v-btn icon="mdi-delete" size="xsmall" variant="plain" @click="removeOption(option.id)" />
          </template>
        </v-text-field>
      </div>
    </template>
    <template v-if="question.type === 'multiple'">
      <div class="pa-2">
        <v-text-field
          v-for="option in question.options"
          :key="option.id"
          v-model="option.content"
          variant="underlined"
          hide-details
        >
          <template #prepend>
            <v-checkbox-btn class="disabled-field" density="compact" hide-details />
          </template>
          <template #append>
            <v-btn icon="mdi-delete" size="xsmall" variant="plain" @click="removeOption(option.id)" />
          </template>
        </v-text-field>
      </div>
    </template>
  </v-sheet>
</template>

<style scoped>
.disabled-field {
  pointer-events: none;
}
</style>
