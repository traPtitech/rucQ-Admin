<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { format, formatISO, parseISO } from 'date-fns'
import type { components } from '@/api/schema'

const questionGroup = defineModel<components['schemas']['QuestionGroupResponse']>({
  required: true,
})

const display = useDisplay()
const isSmAndUp = display.smAndUp

const required = [(v: unknown) => !!v]

const questionsDueDate = computed({
  get() {
    if (!questionGroup.value.due) return
    return format(parseISO(questionGroup.value.due), 'yyyy-MM-dd')
  },
  set(value: string) {
    if (!value) return
    const parsedDate = parseISO(value)
    questionGroup.value.due = formatISO(parsedDate)
  },
})
</script>

<template>
  <div class="mb-1">
    <div class="d-flex align-start ga-4 mb-4">
      <v-text-field
        v-model="questionGroup.name"
        class="title-input"
        label="質問グループ名*"
        variant="underlined"
        density="compact"
        hide-details
        :rules="required"
        required
      />
      <v-text-field
        v-if="isSmAndUp"
        v-model="questionsDueDate"
        class="flex-grow-0 mx-2"
        label="回答期限*"
        variant="outlined"
        density="compact"
        min-width="150"
        hide-details
        type="date"
        :rules="required"
        required
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
      :rules="required"
    />
  </div>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
