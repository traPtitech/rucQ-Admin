import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']

const fetchParticipants = async (campId: number): Promise<User[]> => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const createParticipant = async (variables: { campId: number; userId: string }): Promise<void> => {
  const { campId, userId } = variables
  const { error } = await apiClient.POST('/api/admin/camps/{campId}/participants', {
    params: { path: { campId } },
    body: { userId },
  })
  if (error) throw error
}

const deleteParticipant = async (variables: { campId: number; userId: string }): Promise<void> => {
  const { campId, userId } = variables
  const { error } = await apiClient.DELETE('/api/admin/camps/{campId}/participants/{userId}', {
    params: { path: { campId, userId } },
  })
  if (error) throw error
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

export const useCreateParticipantMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: (_data, variables) => {
      const { campId } = variables
      queryClient.invalidateQueries({ queryKey: ['participants', campId] })
    },
  })
}

export const useDeleteParticipantMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteParticipant,
    onSuccess: (_data, variables) => {
      const { campId, userId } = variables
      queryClient.setQueryData<User[]>(['participants', campId], (old) =>
        old?.filter((user) => user.id !== userId),
      )
    },
  })
}
