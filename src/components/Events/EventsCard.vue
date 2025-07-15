<script setup lang="ts">
import { ref } from 'vue'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import EventItem from '@/components/Events/EventItem.vue'
import EventEditor from '@/components/Events/EventEditor.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  date: string
  events: components['schemas']['EventResponse'][]
}>()

const emit = defineEmits<{
  (e: 'create', event: components['schemas']['EventRequest']): void
  (e: 'update', id: number, event: components['schemas']['EventRequest']): void
  (e: 'delete', eventId: number): void
}>()

const isModalOpen = ref(false)

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d(EEEEE)', { locale: ja })
}

const handleCreate = (id: number | undefined, event: components['schemas']['EventRequest']) => {
  if (id !== undefined) return
  emit('create', event)
  isModalOpen.value = false
}
const handleUpdate = (id: number, event: components['schemas']['EventRequest']) => {
  emit('update', id, event)
}
const handleDelete = (eventId: number) => {
  emit('delete', eventId)
}
</script>

<template>
  <section-title
    :title="formatDate(props.date)"
    action-icon="mdi-plus"
    @action="isModalOpen = true"
  />
  <section-card>
    <event-item
      v-for="event in props.events"
      :key="event.id"
      :date="date"
      :event="event"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </section-card>
  <v-dialog v-model="isModalOpen" max-width="600" max-height="80vh">
    <event-editor
      :date="date"
      @cancel="isModalOpen = false"
      @update="handleCreate"
      @delete="handleDelete"
    />
  </v-dialog>
</template>
