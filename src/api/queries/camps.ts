import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type CampRequest = components['schemas']['CampRequest']

const fetchCamps = async (): Promise<Camp[]> => {
  const { data, error } = await apiClient.GET('/api/camps')
  if (error) throw error
  return data
}

const createCamp = async (variables: { newCamp: CampRequest }): Promise<Camp> => {
  const { newCamp } = variables
  const { data, error } = await apiClient.POST('/api/admin/camps', {
    body: newCamp,
  })
  if (error) throw error
  return data
}

const updateCamp = async (variables: {
  campId: number
  updatedCamp: CampRequest
}): Promise<Camp> => {
  const { campId, updatedCamp } = variables
  const { data, error } = await apiClient.PUT('/api/admin/camps/{campId}', {
    params: { path: { campId } },
    body: updatedCamp,
  })
  if (error) throw error
  return data
}

const deleteCamp = async (variables: { campId: number }): Promise<void> => {
  const { campId } = variables
  const { error } = await apiClient.DELETE('/api/admin/camps/{campId}', {
    params: { path: { campId } },
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
    queryKey: ['camps', campname.value],
    queryFn: fetchCamps,
    select: (camps) => camps.find((camp) => camp.displayId === campname.value),
  })
}

export const useCreateCampMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCamp,
    onSuccess: (data) => {
      queryClient.setQueryData<Camp[]>(['camps'], (old) => (old ? [...old, data] : [data]))
    },
  })
}

export const useUpdateCampMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCamp,
    onSuccess: (data) => {
      queryClient.setQueryData<Camp[]>(['camps'], (old) =>
        old ? old.map((camp) => (camp.id === data.id ? data : camp)) : [data],
      )
    },
  })
}

export const useDeleteCampMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCamp,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Camp[]>(['camps'], (old) =>
        old ? old.filter((camp) => camp.id !== variables.campId) : [],
      )
    },
  })
}
