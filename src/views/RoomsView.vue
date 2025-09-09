<script setup lang="ts">
import { ref } from 'vue'
import RoomGroup from '@/components/Rooms/RoomGroup.vue'
import CreateRoomGroupButton from '@/components/Rooms/CreateRoomGroupButton.vue'
import RoomGroupEditor from '@/components/Rooms/RoomGroupEditor.vue'
import { useCurrentCampQuery } from '@/api/queries/camps'
import {
  useRoomGroupsQuery,
  useCreateRoomGroupMutation,
  useUpdateRoomGroupMutation,
  useDeleteRoomGroupMutation,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '@/api/queries/rooms'
import type { components } from '@/api/schema'
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']
type RoomRequest = components['schemas']['RoomRequest']

const { data: camp } = useCurrentCampQuery()
const { data: roomGroups } = useRoomGroupsQuery()
const { mutate: createRoomGroup } = useCreateRoomGroupMutation()
const { mutate: updateRoomGroup } = useUpdateRoomGroupMutation()
const { mutate: deleteRoomGroup } = useDeleteRoomGroupMutation()
const { mutate: createRoom } = useCreateRoomMutation()
const { mutate: updateRoom } = useUpdateRoomMutation()
const { mutate: deleteRoom } = useDeleteRoomMutation()

const isModalOpen = ref(false)

const handleCreateRoomGroup = (newRoomGroup: RoomGroupRequest) => {
  if (!camp.value) return
  createRoomGroup({ campId: camp.value.id, newRoomGroup })
  isModalOpen.value = false
}

const handleUpdateRoomGroup = (roomGroupId: number, updatedRoomGroup: RoomGroupRequest) =>
  updateRoomGroup({ roomGroupId, updatedRoomGroup })

const handleDeleteRoomGroup = (roomGroupId: number) => deleteRoomGroup({ roomGroupId })

const handleCreateRoom = (newRoom: RoomRequest) => createRoom({ newRoom })

const handleUpdateRoom = (roomId: number, updatedRoom: RoomRequest) =>
  updateRoom({ roomId, updatedRoom })

const handleDeleteRoom = (roomId: number) => deleteRoom({ roomId })
</script>

<template>
  <v-container max-width="800">
    <room-group
      v-for="group in roomGroups"
      :key="group.id"
      :room-group="group"
      @createRoom="handleCreateRoom"
      @updateRoom="handleUpdateRoom"
      @deleteRoom="handleDeleteRoom"
      @updateRoomGroup="handleUpdateRoomGroup"
      @deleteRoomGroup="handleDeleteRoomGroup"
    />
    <create-room-group-button @click="isModalOpen = true" />
    <v-dialog v-model="isModalOpen" max-width="600" persistent>
      <room-group-editor @save="handleCreateRoomGroup" @cancel="isModalOpen = false" />
    </v-dialog>
  </v-container>
</template>
