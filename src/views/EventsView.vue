<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { eachDayOfInterval, format, isSameDay, isValid, parseISO } from 'date-fns'
import EventsCard from '@/components/Events/EventsCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<components['schemas']['CampResponse']>()
const events = ref<components['schemas']['EventResponse'][]>()

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
          return isValid(parseISO(event.timeStart)) && isSameDay(parseISO(event.timeEnd), day)
        case 'moment':
          return isValid(parseISO(event.time)) && isSameDay(parseISO(event.time), day)
        default:
          throw new Error(`Unexpected event type: ${event satisfies never}`)
      }
    })
    return { date: formattedDate, events: dailyEvents }
  })
}

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}
const fetchEvents = async () => {
  if (!camp.value) return
  const response = await apiClient.GET('/api/camps/{campId}/events', {
    params: { path: { campId: camp.value.id } },
  })
  return response.data
}

onMounted(async () => {
  camp.value = await fetchCamp()
  events.value = await fetchEvents()
})

const createEvent = async (event: components['schemas']['EventRequest']) => {
  if (!camp.value) return
  await apiClient.POST('/api/camps/{campId}/events', {
    params: { path: { campId: camp.value.id } },
    body: event,
  })
  events.value = await fetchEvents()
}
const updateEvent = async (id: number, event: components['schemas']['EventRequest']) => {
  if (!camp.value) return
  await apiClient.PUT('/api/events/{eventId}', {
    params: { path: { eventId: id } },
    body: event,
  })
  events.value = await fetchEvents()
}
const deleteEvent = async (eventId: number) => {
  if (!camp.value) return
  await apiClient.DELETE('/api/events/{eventId}', {
    params: { path: { eventId } },
  })
  events.value = await fetchEvents()
}
</script>

<template>
  <v-container v-if="camp && events !== undefined" max-width="800">
    <events-card
      v-for="group in groupedEvents(camp.dateStart, camp.dateEnd, events)"
      :key="group.date"
      :date="group.date"
      :events="group.events"
      @create="createEvent"
      @update="updateEvent"
      @delete="deleteEvent"
    />
  </v-container>
</template>
