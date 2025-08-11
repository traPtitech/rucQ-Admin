<script setup lang="ts">
import { useDisplay } from 'vuetify'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import type { VAutocomplete } from 'vuetify/components'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']

const autocompleteRef = defineModel<VAutocomplete | null>('autocompleteRef', { default: null })
const selectedId = defineModel<string | null>('selectedId', { default: null })

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'tab-pressed'): void
}>()

const display = useDisplay()
const isSmAndUp = display.smAndUp

const paymentId = (id: string) => {
  return id.toUpperCase().replace(/[-_]/g, '')
}

const customFilter = (value: string, query: string, item: unknown) => {
  const id = (item as { raw: User }).raw.id
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
      v-model="selectedId"
      :class="isSmAndUp ? 'title-input-desktop' : 'title-input-mobile'"
      :items="users"
      item-title="id"
      item-value="id"
      :custom-filter="customFilter"
      label="振込名義ID"
      variant="outlined"
      auto-select-first
      hide-details
      @keydown="handleKeyDown"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="paymentId(item.raw.id)">
          <template #prepend>
            <user-avatar :user-id="item.raw.id" />
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
