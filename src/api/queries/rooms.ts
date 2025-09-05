import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCurrentCampQuery } from '@/api/queries/camps'
import { apiClient } from '@/api/apiClient'
import { queryKeys } from '@/api/query-keys'
import type { components } from '@/api/schema'
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']
type Room = components['schemas']['RoomResponse']
type RoomRequest = components['schemas']['RoomRequest']

const fetchRoomGroups = async (campId: number): Promise<RoomGroup[]> => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/room-groups', {
    params: { path: { campId } },
  })
  if (error) throw error
  return data
}

const createRoomGroup = async (variables: {
  campId: number
  newRoomGroup: RoomGroupRequest
}): Promise<RoomGroup> => {
  const { campId, newRoomGroup } = variables
  const { data, error } = await apiClient.POST('/api/admin/camps/{campId}/room-groups', {
    params: { path: { campId } },
    body: newRoomGroup,
  })
  if (error) throw error
  return data
}

const updateRoomGroup = async (variables: {
  roomGroupId: number
  updatedRoomGroup: RoomGroupRequest
}): Promise<RoomGroup> => {
  const { roomGroupId, updatedRoomGroup } = variables
  const { data, error } = await apiClient.PUT('/api/admin/room-groups/{roomGroupId}', {
    params: { path: { roomGroupId } },
    body: updatedRoomGroup,
  })
  if (error) throw error
  return data
}

const deleteRoomGroup = async (variables: { roomGroupId: number }): Promise<void> => {
  const { roomGroupId } = variables
  const { error } = await apiClient.DELETE('/api/admin/room-groups/{roomGroupId}', {
    params: { path: { roomGroupId } },
  })
  if (error) throw error
}

const createRoom = async (variables: { newRoom: RoomRequest }): Promise<Room> => {
  const { newRoom } = variables
  const { data, error } = await apiClient.POST('/api/admin/rooms', {
    body: newRoom,
  })
  if (error) throw error
  return data
}

const updateRoom = async (variables: {
  roomId: number
  updatedRoom: RoomRequest
}): Promise<Room> => {
  const { roomId, updatedRoom } = variables
  const { data, error } = await apiClient.PUT('/api/admin/rooms/{roomId}', {
    params: { path: { roomId } },
    body: updatedRoom,
  })
  if (error) throw error
  return data
}

const deleteRoom = async (variables: { roomId: number }): Promise<void> => {
  const { roomId } = variables
  const { error } = await apiClient.DELETE('/api/admin/rooms/{roomId}', {
    params: { path: { roomId } },
  })
  if (error) throw error
}

export const useRoomGroupsQuery = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  return useQuery({
    queryKey: queryKeys.roomGroups.all(campId.value),
    queryFn: () => fetchRoomGroups(campId.value!),
    enabled: computed(() => campId.value !== undefined),
  })
}

export const useCreateRoomGroupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRoomGroup,
    onSuccess: (data, variables) => {
      const { campId } = variables
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId), (old) =>
        old ? [...old, data] : [data],
      )
    },
  })
}

export const useUpdateRoomGroupMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRoomGroup,
    onSuccess: (data) => {
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId.value), (old) =>
        old?.map((group) => (group.id === data.id ? data : group)),
      )
    },
  })
}

export const useDeleteRoomGroupMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRoomGroup,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId.value), (old) =>
        old?.filter((group) => group.id !== variables.roomGroupId),
      )
    },
  })
}

export const useCreateRoomMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRoom,
    onSuccess: (data, variables) => {
      const { newRoom } = variables
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId.value), (old) =>
        old?.map((group) =>
          group.id === newRoom.roomGroupId
            ? {
                ...group,
                rooms: [...group.rooms, data],
              }
            : group,
        ),
      )
    },
  })
}

export const useUpdateRoomMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (data, variables) => {
      const { roomId, updatedRoom } = variables
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId.value), (old) =>
        old?.map((group) =>
          group.id === updatedRoom.roomGroupId
            ? {
                ...group,
                rooms: group.rooms.map((room) => (room.id === roomId ? data : room)),
              }
            : group,
        ),
      )
    },
  })
}

export const useDeleteRoomMutation = () => {
  const { data: camp } = useCurrentCampQuery()
  const campId = computed(() => camp.value?.id)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: (_data, variables) => {
      const { roomId } = variables
      queryClient.setQueryData<RoomGroup[]>(queryKeys.roomGroups.all(campId.value), (old) =>
        old?.map((group) => ({
          ...group,
          rooms: group.rooms.filter((room) => room.id !== roomId),
        })),
      )
    },
  })
}