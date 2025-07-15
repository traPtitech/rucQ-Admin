<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import EventItem from '@/components/Events/EventItem.vue'
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

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d(EEEEE)', { locale: ja })
}

const handleUpdate = (id: number, event: components['schemas']['EventRequest']) => {
  emit('update', id, event)
}
const handleDelete = (eventId: number) => {
  emit('delete', eventId)
}
</script>

<template>
  <section-title :title="formatDate(props.date)" />
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
</template>
