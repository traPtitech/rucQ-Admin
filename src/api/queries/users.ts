import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
type UserRequest = components['schemas']['UserRequest']
type MessageRequest = components['schemas']['MessageRequest']

const fetchStaffs = async (): Promise<User[]> => {
  const { data, error } = await apiClient.GET('/api/staffs')
  if (error) throw error
  return data
}

const fetchUser = async (variables: { userId: string }): Promise<User> => {
  const { userId } = variables
  const { data, error } = await apiClient.GET('/api/admin/users/{userId}', {
    params: { path: { userId } },
  })
  if (error) throw error
  return data
}

const updateUser = async (variables: {
  userId: string
  updatedUser: UserRequest
}): Promise<User> => {
  const { userId, updatedUser } = variables
  const { data, error } = await apiClient.PUT('/api/admin/users/{userId}', {
    params: { path: { userId } },
    body: updatedUser,
  })
  if (error) throw error
  return data
}

const createMessage = async (variables: {
  userId: string
  newMessage: MessageRequest
}): Promise<void> => {
  const { userId, newMessage } = variables
  const { error } = await apiClient.POST('/api/admin/users/{userId}/messages', {
    params: { path: { userId } },
    body: newMessage,
  })
  if (error) throw error
}

export const useStaffsQuery = () => {
  return useQuery({
    queryKey: ['staffs'],
    queryFn: fetchStaffs,
  })
}

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser({ userId }),
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData<User>(['users', data.id], data)
    },
  })
}

export const useCreateMessageMutation = () => {
  return useMutation({
    mutationFn: createMessage,
  })
}
