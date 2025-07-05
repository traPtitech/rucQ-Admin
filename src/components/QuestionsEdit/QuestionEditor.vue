<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateNewTemporaryId, isAssignedId } from '@/utils/temporaryIdManager'
import type { components } from '@/api/schema'

const question = defineModel<components['schemas']['QuestionResponse']>({ required: true })

defineProps<{
  isNewQuestionGroup?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', questionId: number): void
}>()
const required = [(v: unknown) => !!v]

const questionTypes = [
  { value: 'free_text', title: '記述式', props: { prependIcon: 'mdi-text-short' } },
  { value: 'free_number', title: '数値', props: { prependIcon: 'mdi-numeric' } },
  { value: 'single', title: 'ラジオボタン', props: { prependIcon: 'mdi-radiobox-marked' } },
  { value: 'multiple', title: 'チェックボックス', props: { prependIcon: 'mdi-checkbox-outline' } },
]
const selectedIcon = computed(() => {
  const type = question.value.type
  return questionTypes.find((q) => q.value === type)?.props?.prependIcon
})

const newOptionContent = ref<string>('')

const addOption = () => {
  if ('options' in question.value) {
    question.value.options.push({
      id: generateNewTemporaryId(),
      content: newOptionContent.value,
    })
    newOptionContent.value = ''
  }
}

const removeOption = (optionId: number) => {
  if ('options' in question.value) {
    question.value.options = question.value.options.filter((option) => option.id !== optionId)
  }
}

const handleTypeChange = () => {
  if (question.value.type === 'single' || question.value.type === 'multiple') {
    question.value = {
      ...question.value,
      options: [],
    }
  } else if ('options' in question.value) {
    delete question.value.options
  }
}
</script>

<template>
  <v-sheet elevation="2" rounded class="question-sheet pa-4">
    <v-row class="mb-0">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="question.title"
          class="label-input"
          label="質問*"
          hide-details
          :rules="required"
          required
        />
      </v-col>
      <v-col cols="12" sm="6">
        <div class="d-flex align-center ga-2">
          <v-select
            v-model="question.type"
            :items="questionTypes"
            label="質問タイプ"
            :prepend-inner-icon="selectedIcon"
            :disabled="isAssignedId(question.id)"
            variant="outlined"
            hide-details
            required
            @update:model-value="handleTypeChange"
          />
          <v-btn
            class="ma-2"
            icon="mdi-delete"
            size="medium"
            variant="plain"
            @click="emit('delete', question.id)"
          />
        </div>
      </v-col>
    </v-row>
    <div class="d-flex flex-column flex-sm-row align-sm-center ga-2 mx-2">
      <v-text-field
        v-model="question.description"
        label="説明"
        variant="underlined"
        density="comfortable"
        hide-details
      />
      <div class="d-flex ga-2">
        <v-checkbox
          v-model="question.isPublic"
          label="回答を公開"
          color="primary"
          density="compact"
          :disabled="isAssignedId(question.id)"
          hide-details
        />
        <v-checkbox
          v-model="question.isOpen"
          label="回答可能"
          color="primary"
          density="compact"
          hide-details
        />
      </div>
    </div>
    <template v-if="question.type === 'free_text'">
      <v-text-field class="disabled-field mt-4" label="自由記述" hide-details />
    </template>
    <template v-if="question.type === 'free_number'">
      <v-text-field class="disabled-field mt-4" label="数値入力" hide-details />
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
          <template v-if="isNewQuestionGroup" #append>
            <v-btn
              icon="mdi-close"
              size="medium"
              variant="plain"
              @click="removeOption(option.id)"
            />
          </template>
        </v-text-field>
        <v-text-field
          v-if="isNewQuestionGroup"
          v-model="newOptionContent"
          placeholder="新しい選択肢を追加"
          variant="underlined"
          hide-details
        >
          <template #prepend>
            <v-radio class="disabled-field" density="compact" hide-details />
          </template>
          <template #append>
            <v-btn icon="mdi-plus" size="medium" variant="plain" @click="addOption()" />
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
          <template v-if="isNewQuestionGroup" #append>
            <v-btn
              icon="mdi-close"
              size="medium"
              variant="plain"
              @click="removeOption(option.id)"
            />
          </template>
        </v-text-field>
        <v-text-field
          v-if="isNewQuestionGroup"
          v-model="newOptionContent"
          placeholder="新しい選択肢を追加"
          variant="underlined"
          hide-details
        >
          <template #prepend>
            <v-checkbox-btn class="disabled-field" density="compact" hide-details />
          </template>
          <template #append>
            <v-btn icon="mdi-plus" size="medium" variant="plain" @click="addOption()" />
          </template>
        </v-text-field>
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
.label-input :deep(.v-field__input) {
  font-size: 1.17rem;
  font-weight: 500;
}
</style>
