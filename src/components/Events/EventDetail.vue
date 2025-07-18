<script setup lang="ts">
import { parseISO, format } from 'date-fns'
import { convertMarkdownToSafeHtml } from '@/utils/markdownConverter'
import type { components } from '@/api/schema'

defineProps<{
  date: string
  event: components['schemas']['EventResponse']
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d')
}
const formatTime = (time: string) => {
  return format(parseISO(time), 'HH:mm')
}
</script>

<template>
  <v-card>
    <div class="d-flex align-center px-6 pt-4 pb-2">
      <v-card-title class="text-h5 pa-0">{{ event.name }}</v-card-title>
      <v-spacer />
      <v-btn
        icon="mdi-pencil"
        size="small"
        density="comfortable"
        variant="plain"
        @click="emit('edit')"
      />
    </div>
    <v-divider class="mx-4" />
    <v-card-text class="px-6 pt-3 pb-4">
      <div>
        <div>
          <div class="text-body-2">日時</div>
          <div class="text-h6">
            {{ formatDate(date) }}
            {{
              event.type === 'moment'
                ? formatTime(event.time)
                : `${formatTime(event.timeStart)} - ${formatTime(event.timeEnd)}`
            }}
          </div>
        </div>
        <div>
          <div class="text-body-2">場所</div>
          <div class="text-h6">{{ event.location }}</div>
        </div>
        <div>
          <div class="text-body-2">主催</div>
          <div class="text-h6">
            {{ event.type === 'duration' ? `@${event.organizerId}` : 'staff' }}
          </div>
        </div>
      </div>
      <div v-if="event.description">
        <v-divider class="my-4 mx-n2" />
        <article>
          <div v-html="convertMarkdownToSafeHtml(event.description)" class="markdown-body"></div>
        </article>
      </div>
    </v-card-text>
  </v-card>
</template>
