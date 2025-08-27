<script setup lang="ts">
import { eachDayOfInterval, format, isSameDay, isValid, parseISO } from 'date-fns'
import EventsCard from '@/components/Events/EventsCard.vue'
import { useCurrentCampQuery } from '@/api/queries/camps'
import {
  useEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from '@/api/queries/events'
import type { components } from '@/api/schema'

type EventRequest = components['schemas']['EventRequest']

const { data: camp } = useCurrentCampQuery()
const { data: events } = useEventsQuery()
const { mutate: createEvent } = useCreateEventMutation()
const { mutate: updateEvent } = useUpdateEventMutation()
const { mutate: deleteEvent } = useDeleteEventMutation()

const handleCreate = (newEvent: EventRequest) => createEvent({ newEvent })
const handleUpdate = (eventId: number, updatedEvent: EventRequest) =>
  updateEvent({ eventId, updatedEvent })
const handleDelete = (eventId: number) => deleteEvent({ eventId })

// 日付ごとにイベントをグループ化
const groupedEvents = (
  dateStart: string,
  dateEnd: string,
  events: components['schemas']['EventResponse'][],
) => {
  const start = parseISO(dateStart)
  const end = parseISO(dateEnd)
  if (!isValid(start) || !isValid(end) || end < start) return
  const days = eachDayOfInterval({ start, end })

  return days.map((day) => {
    const formattedDate = format(day, 'yyyy-MM-dd')
    const dailyEvents = events.filter((event) => {
      switch (event.type) {
        case 'duration':
          return isValid(parseISO(event.timeStart)) && isSameDay(parseISO(event.timeStart), day)
        case 'official':
          return isValid(parseISO(event.timeStart)) && isSameDay(parseISO(event.timeStart), day)
        case 'moment':
          return isValid(parseISO(event.time)) && isSameDay(parseISO(event.time), day)
        default:
          throw new Error(`Unexpected event type: ${event satisfies never}`)
      }
    })
    return { date: formattedDate, events: dailyEvents }
  })
}
</script>

<template>
  <v-container v-if="camp && events !== undefined" max-width="800">
    <events-card
      v-for="group in groupedEvents(camp.dateStart, camp.dateEnd, events)"
      :key="group.date"
      :date="group.date"
      :events="group.events"
      @create="handleCreate"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </v-container>
</template>
