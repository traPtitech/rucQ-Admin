<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RoomGroup from '@/components/Rooms/RoomGroup.vue'
import CreateRoomGroupButton from '@/components/Rooms/CreateRoomGroupButton.vue'
import RoomGroupEditor from '@/components/Rooms/RoomGroupEditor.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']
type RoomRequest = components['schemas']['RoomRequest']

const route = useRoute()
const campname = route.params.campname as string
const camp = ref<Camp>()
const participants = ref<User[]>([])
const roomGroups = ref<RoomGroup[]>([])
const isModalOpen = ref(false)

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}

const fetchParticipants = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

const fetchRoomGroups = async () => {
  if (!camp.value) return
  const { data } = await apiClient.GET('/api/camps/{campId}/room-groups', {
    params: { path: { campId: camp.value.id } },
  })
  return data
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = (await fetchParticipants()) ?? []
  roomGroups.value = (await fetchRoomGroups()) ?? []
})

const createRoomGroup = async (roomGroup: RoomGroupRequest) => {
  if (!camp.value) return
  const { data } = await apiClient.POST('/api/admin/camps/{campId}/room-groups', {
    params: { path: { campId: camp.value.id } },
    body: roomGroup,
  })
  if (data) roomGroups.value.push(data)
}

const updateRoomGroup = async (roomGroupId: number, roomGroup: RoomGroupRequest) => {
  if (!camp.value) return
  const { data } = await apiClient.PUT('/api/admin/room-groups/{roomGroupId}', {
    params: { path: { roomGroupId } },
    body: roomGroup,
  })
  if (data) {
    const index = roomGroups.value.findIndex((group) => group.id === roomGroupId)
    if (index !== -1) roomGroups.value[index] = data
  }
}

const deleteRoomGroup = async (roomGroupId: number) => {
  if (!camp.value) return
  const { error } = await apiClient.DELETE('/api/admin/room-groups/{roomGroupId}', {
    params: { path: { roomGroupId } },
  })
  if (!error) {
    const index = roomGroups.value.findIndex((group) => group.id === roomGroupId)
    if (index !== -1) roomGroups.value.splice(index, 1)
  }
}

const createRoom = async (room: RoomRequest) => {
  if (!camp.value) return
  const { data } = await apiClient.POST('/api/admin/rooms', {
    body: room,
  })
  if (data) {
    const group = roomGroups.value.find((group) => group.id === room.roomGroupId)
    if (group) group.rooms.push(data)
  }
}

const updateRoom = async (roomId: number, room: RoomRequest) => {
  if (!camp.value) return
  const { data } = await apiClient.PUT('/api/admin/rooms/{roomId}', {
    params: { path: { roomId } },
    body: room,
  })
  if (data) {
    const group = roomGroups.value.find((group) => group.id === room.roomGroupId)
    if (group) {
      const index = group.rooms.findIndex((r) => r.id === roomId)
      if (index !== -1) group.rooms[index] = data
    }
  }
}

const deleteRoom = async (roomId: number) => {
  if (!camp.value) return
  const { error } = await apiClient.DELETE('/api/admin/rooms/{roomId}', {
    params: { path: { roomId } },
  })
  if (!error) {
    for (const group of roomGroups.value) {
      const index = group.rooms.findIndex((r) => r.id === roomId)
      if (index !== -1) {
        group.rooms.splice(index, 1)
        break
      }
    }
  }
}

const handleCreateRoomGroup = (roomGroup: RoomGroupRequest) => {
  createRoomGroup(roomGroup)
  isModalOpen.value = false
}
</script>

<template>
  <v-container max-width="800">
    <room-group
      v-for="group in roomGroups"
      :key="group.id"
      :room-group="group"
      @createRoom="createRoom"
      @updateRoom="updateRoom"
      @deleteRoom="deleteRoom"
      @updateRoomGroup="updateRoomGroup"
      @deleteRoomGroup="deleteRoomGroup"
    />
    <create-room-group-button @click="isModalOpen = true" />
    <v-dialog v-model="isModalOpen" max-width="600" persistent>
      <room-group-editor @save="handleCreateRoomGroup" @cancel="isModalOpen = false" />
    </v-dialog>
  </v-container>
</template>
