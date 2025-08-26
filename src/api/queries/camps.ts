import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type CampRequest = components['schemas']['CampRequest']

const fetchCamps = async (): Promise<Camp[]> => {
  const { data, error } = await apiClient.GET('/api/camps')
  if (error) throw error
  return data
}

const fetchParticipants = async (campId: number): Promise<User[]> => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const updateCamp = async (variables: { campId: number; updatedCamp: CampRequest }) => {
  const { campId, updatedCamp } = variables
  const { error } = await apiClient.PUT('/api/admin/camps/{campId}', {
    params: { path: { campId } },
    body: updatedCamp,
  })
  if (error) throw error
}

export const useCampsQuery = () => {
  return useQuery({
    queryKey: ['camps'],
    queryFn: fetchCamps,
  })
}

export const useCurrentCampQuery = () => {
  const route = useRoute()
  const campname = computed(() => route.params.campname as string)
  return useQuery({
    queryKey: ['camps'],
    queryFn: fetchCamps,
    select: (camps) => camps.find((camp) => camp.displayId === campname.value),
    enabled: computed(() => !!campname.value),
  })
}

export const useParticipantsQuery = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useQuery({
    queryKey: ['participants', campId],
    queryFn: () => fetchParticipants(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useUpdateCampMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camps'] })
    },
  })
}
