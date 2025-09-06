<script setup lang="ts">
import { ref } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import RoomItem from '@/components/Rooms/RoomItem.vue'
import RoomEditor from '@/components/Rooms/RoomEditor.vue'
import RoomGroupEditor from '@/components/Rooms/RoomGroupEditor.vue'
import type { components } from '@/api/schema'
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']
type RoomRequest = components['schemas']['RoomRequest']

const props = defineProps<{
  roomGroup: RoomGroup
}>()

const emit = defineEmits<{
  (e: 'createRoom', room: RoomRequest): void
  (e: 'updateRoom', roomId: number, room: RoomRequest): void
  (e: 'deleteRoom', roomId: number): void
  (e: 'updateRoomGroup', roomGroupId: number, roomGroup: RoomGroupRequest): void
  (e: 'deleteRoomGroup', roomGroupId: number): void
}>()

const isRoomEditorOpen = ref(false)
const isRoomGroupEditorOpen = ref(false)
const isDeleteModalOpen = ref(false)

const handleCreateRoom = (room: RoomRequest) => {
  emit('createRoom', room)
  isRoomEditorOpen.value = false
}

const handleUpdateRoomGroup = (roomGroup: RoomGroupRequest) => {
  emit('updateRoomGroup', props.roomGroup.id, roomGroup)
  isRoomGroupEditorOpen.value = false
}

const handleDeleteRoomGroup = () => {
  emit('deleteRoomGroup', props.roomGroup.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <section-title :title="roomGroup.name">
    <template #actions>
      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            class="mr-2"
            icon="mdi-dots-vertical"
            size="medium"
            variant="plain"
          />
        </template>
        <v-list>
          <v-list-item
            title="部屋の作成"
            prepend-icon="mdi-plus"
            @click="isRoomEditorOpen = true"
          />
          <v-list-item
            title="部屋グループの編集"
            prepend-icon="mdi-pencil"
            @click="isRoomGroupEditorOpen = true"
          />
          <v-list-item
            title="部屋グループの削除"
            prepend-icon="mdi-delete"
            base-color="error"
            @click="isDeleteModalOpen = true"
          />
        </v-list>
      </v-menu>
    </template>
  </section-title>
  <section-card>
    <room-item
      v-for="room in roomGroup.rooms"
      :key="room.id"
      :room-group-id="roomGroup.id"
      :room="room"
      @update="(roomId, room) => emit('updateRoom', roomId, room)"
      @delete="(roomId) => emit('deleteRoom', roomId)"
    />
  </section-card>
  <v-dialog v-model="isRoomEditorOpen" max-width="600" persistent>
    <room-editor
      :room-group-id="roomGroup.id"
      @save="handleCreateRoom"
      @cancel="isRoomEditorOpen = false"
    />
  </v-dialog>
  <v-dialog v-model="isRoomGroupEditorOpen" max-width="600" persistent>
    <room-group-editor
      :room-group="roomGroup"
      @save="handleUpdateRoomGroup"
      @cancel="isRoomGroupEditorOpen = false"
    />
  </v-dialog>
  <v-dialog v-model="isDeleteModalOpen" max-width="400" persistent>
    <v-card title="部屋グループの削除">
      <v-card-text> この部屋グループを削除しますか？ </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="isDeleteModalOpen = false">キャンセル</v-btn>
        <v-btn color="error" @click="handleDeleteRoomGroup">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
