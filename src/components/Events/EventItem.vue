<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { format, parseISO } from 'date-fns'
import ContentCard from '@/components/shared/ContentCard.vue'
import EventDetail from '@/components/Events/EventDetail.vue'
import EventEditor from '@/components/Events/EventEditor.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  date: string
  event: components['schemas']['EventResponse']
}>()

const emit = defineEmits<{
  (e: 'update', id: number, event: components['schemas']['EventRequest']): void
  (e: 'delete', eventId: number): void
}>()

const officialColor = 'navy'
const display = useDisplay()
const isSmAndUp = display.smAndUp
const isDetailOpen = ref(false)
const isEditing = ref(false)

const borderColor = computed(() => {
  if (props.event.type === 'duration') return props.event.displayColor
  return officialColor
})

const formatTime = (time: string) => {
  return format(parseISO(time), 'HH:mm')
}

const handleUpdate = (id: number | undefined, event: components['schemas']['EventRequest']) => {
  if (id === undefined) return
  emit('update', id, event)
  isDetailOpen.value = false
}
const handleDelete = (eventId: number) => {
  emit('delete', eventId)
  isDetailOpen.value = false
}

watch(isDetailOpen, (newValue) => {
  if (!newValue) isEditing.value = false
})
</script>

<template>
  <content-card :border-color="borderColor" @click="isDetailOpen = !isDetailOpen">
    <div class="d-flex align-center ga-4 py-2">
      <div v-if="event.type === 'moment'" class="d-flex flex-column align-center pa-1">
        <span>
          {{ formatTime(event.time) }}
        </span>
      </div>
      <div v-else class="d-flex flex-column align-center ga-1 pa-1">
        <span>
          {{ formatTime(event.timeStart) }}
        </span>
        <div :class="$style.separator"></div>
        <span>
          {{ formatTime(event.timeEnd) }}
        </span>
      </div>
      <div v-if="isSmAndUp" class="d-flex align-end ga-2">
        <h3 class="text-h6">{{ event.name }}</h3>
        <span class="text-body-1 text-medium-emphasis">
          by {{ event.type === 'duration' ? `@${event.organizerId}` : 'staff' }}
        </span>
      </div>
      <div v-else class="d-flex flex-column">
        <h3 class="text-h6">{{ event.name }}</h3>
        <span class="text-body-1 text-medium-emphasis">
          by {{ event.type === 'duration' ? `@${event.organizerId}` : 'staff' }}
        </span>
      </div>
    </div>
  </content-card>
  <v-dialog
    v-model="isDetailOpen"
    max-width="600"
    max-height="85vh"
    :persistent="isEditing"
    scrollable
  >
    <event-detail v-if="!isEditing" :date="date" :event="props.event" @edit="isEditing = true" />
    <event-editor
      v-else
      :date="date"
      :event="props.event"
      @cancel="isEditing = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </v-dialog>
</template>

<style module>
.separator {
  height: 12px;
  width: 1px;
  border-inline-start: 1px solid gray;
}
</style>
