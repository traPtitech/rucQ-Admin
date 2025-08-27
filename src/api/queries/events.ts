import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

type Event = components['schemas']['EventResponse']
type EventRequest = components['schemas']['EventRequest']

const fetchEvents = async (campId: number): Promise<Event[]> => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/events', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const createEvent = async (variables: {
  campId: number
  newEvent: EventRequest
}): Promise<Event> => {
  const { campId, newEvent } = variables
  const { data, error } = await apiClient.POST('/api/camps/{campId}/events', {
    params: { path: { campId } },
    body: newEvent,
  })
  if (error) throw error
  return data
}

const updateEvent = async (variables: {
  eventId: number
  updatedEvent: EventRequest
}): Promise<Event> => {
  const { eventId, updatedEvent } = variables
  const { data, error } = await apiClient.PUT('/api/events/{eventId}', {
    params: { path: { eventId } },
    body: updatedEvent,
  })
  if (error) throw error
  return data
}

const deleteEvent = async (variables: { eventId: number }): Promise<void> => {
  const { eventId } = variables
  const { error } = await apiClient.DELETE('/api/events/{eventId}', {
    params: { path: { eventId } },
  })
  if (error) throw error
}

export const useEventsQuery = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useQuery({
    queryKey: ['events', campId],
    queryFn: () => fetchEvents(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useMutation({
    mutationFn: (variables: { newEvent: EventRequest }) => {
      if (campId.value === undefined) throw new Error('campId is undefined')
      return createEvent({ ...variables, campId: campId.value })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['events', campId.value], (old: Event[] | undefined) =>
        old ? [...old, data] : [data],
      )
    },
  })
}

export const useUpdateEventMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (data) => {
      queryClient.setQueryData(['events', campId.value], (old: Event[] | undefined) =>
        old ? old.map((event) => (event.id === data.id ? data : event)) : [data],
      )
    },
  })
}

export const useDeleteEventMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(['events', campId.value], (old: Event[] | undefined) =>
        old ? old.filter((event) => event.id !== variables.eventId) : [],
      )
    },
  })
}
