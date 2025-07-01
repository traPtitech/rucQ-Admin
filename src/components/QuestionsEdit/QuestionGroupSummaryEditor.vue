<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { components } from '@/api/schema'

const questionGroup = defineModel<components['schemas']['QuestionGroupResponse']>({
  required: true,
})

const display = useDisplay()
const isSmAndUp = display.smAndUp

const questionsDueDate = ref<string>(questionGroup.value.due)
</script>

<template>
  <div class="mb-1">
    <div class="d-flex align-end ga-4 mb-4">
      <v-text-field
        v-model="questionGroup.name"
        class="title-input"
        label="質問グループ名"
        variant="underlined"
        density="compact"
        hide-details
      />
      <v-text-field
        v-if="isSmAndUp"
        v-model="questionsDueDate"
        class="flex-grow-0 mx-2"
        label="回答期限"
        variant="outlined"
        density="compact"
        min-width="150"
        hide-details
        type="date"
      />
    </div>
    <v-textarea
      v-model="questionGroup.description"
      label="説明"
      variant="underlined"
      density="compact"
      rows="1"
      auto-grow
      hide-details
    />
    <v-text-field
      v-if="!isSmAndUp"
      v-model="questionsDueDate"
      class="mt-5"
      label="回答期限"
      variant="outlined"
      density="compact"
      hide-details
      type="date"
    />
  </div>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
