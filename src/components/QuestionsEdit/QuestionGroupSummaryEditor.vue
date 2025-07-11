<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { isValid, parseISO } from 'date-fns'
import type { components } from '@/api/schema'

const questionGroup = defineModel<components['schemas']['QuestionGroupResponse']>({
  required: true,
})

const display = useDisplay()
const isSmAndUp = display.smAndUp

const required = (v: unknown) => !!v
const date = (v: string | undefined) => {
  return !!v && isValid(parseISO(v))
}
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
        :rules="[required]"
        required
      />
      <v-text-field
        v-if="isSmAndUp"
        v-model="questionGroup.due"
        class="flex-grow-0 mx-2"
        label="回答期限*"
        variant="outlined"
        density="compact"
        min-width="150"
        hide-details
        type="date"
        :rules="[required, date]"
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
      v-model="questionGroup.due"
      class="mt-5"
      label="回答期限*"
      variant="outlined"
      density="compact"
      hide-details
      type="date"
      :rules="[required, date]"
    />
  </div>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
