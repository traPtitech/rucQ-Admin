import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import { queryKeys } from '@/api/query-keys'
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
    queryKey: queryKeys.events.all(campId.value),
    queryFn: () => fetchEvents(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEvent,
    onSuccess: (data, variables) => {
      const { campId } = variables
      queryClient.setQueryData<Event[]>(queryKeys.events.all(campId), (old) =>
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
      queryClient.setQueryData<Event[]>(queryKeys.events.all(campId.value), (old) =>
        old?.map((event) => (event.id === data.id ? data : event)),
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
      const { eventId } = variables
      queryClient.setQueryData<Event[]>(queryKeys.events.all(campId.value), (old) =>
        old?.filter((event) => event.id !== eventId),
      )
    },
  })
}
