<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import type { VAutocomplete } from 'vuetify/components'

const autocompleteRef = defineModel<VAutocomplete | null>('autocompleteRef', { default: null })
const selectedId = defineModel<string | undefined>('selectedId', { default: undefined })

defineProps<{
  users: string[]
}>()

const emit = defineEmits<{
  (e: 'tab-pressed'): void
}>()

const display = useDisplay()
const isSmAndUp = display.smAndUp
const autocompleteModel = computed({
  get() {
    return selectedId.value ?? null
  },
  set(newValue: string | null) {
    selectedId.value = newValue ?? undefined
  },
})

const paymentId = (id: string) => {
  return id.toUpperCase().replace(/[-_]/g, '')
}

const customFilter = (value: string, query: string, item: unknown) => {
  const id = (item as { raw: string }).raw
  return paymentId(id).startsWith(query.toUpperCase())
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    emit('tab-pressed')
  }
}
</script>

<template>
  <div class="d-flex align-center ga-4">
    <user-avatar :user-id="selectedId ?? undefined" :size="isSmAndUp ? 64 : 48" />
    <v-autocomplete
      ref="autocompleteRef"
      v-model="autocompleteModel"
      :class="isSmAndUp ? 'title-input-desktop' : 'title-input-mobile'"
      :items="users"
      :custom-filter="customFilter"
      label="振込名義ID"
      variant="outlined"
      auto-select-first
      hide-details
      @keydown="handleKeyDown"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="paymentId(item.raw)">
          <template #prepend>
            <user-avatar :user-id="item.raw" />
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<style scoped>
.title-input-desktop :deep(.v-field__input) {
  font-size: 2rem;
  font-weight: 700;
}

.title-input-mobile :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
