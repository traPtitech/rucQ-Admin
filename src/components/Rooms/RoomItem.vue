<script setup lang="ts">
import { computed, ref } from 'vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import UsersCopyButton from '@/components/shared/UsersCopyButton.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'
import RoomEditor from '@/components/Rooms/RoomEditor.vue'
import type { components } from '@/api/schema'
type Room = components['schemas']['RoomResponse']
type RoomRequest = components['schemas']['RoomRequest']

const props = defineProps<{
  roomGroupId: number
  room: Room
}>()

const emit = defineEmits<{
  (e: 'update', roomId: number, room: RoomRequest): void
  (e: 'delete', roomId: number): void
}>()

const isRoomEditorOpen = ref(false)
const isDeleteModalOpen = ref(false)
const memberIds = computed(() => props.room.members.map((user) => user.id))

const handleUpdateRoom = (room: RoomRequest) => {
  emit('update', props.room.id, room)
  isRoomEditorOpen.value = false
}

const handleDeleteRoom = () => {
  emit('delete', props.room.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <content-card :title="room.name">
    <template #actions>
      <users-copy-button :users="memberIds" />
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
            title="部屋の編集"
            prepend-icon="mdi-pencil"
            @click="isRoomEditorOpen = true"
          />
          <v-list-item
            title="部屋の削除"
            prepend-icon="mdi-delete"
            base-color="error"
            @click="isDeleteModalOpen = true"
          />
        </v-list>
      </v-menu>
    </template>
    <user-avatar-list v-if="memberIds.length" :users="memberIds" />
    <div v-else class="text-medium-emphasis pa-1">メンバーがいません</div>
  </content-card>
  <v-dialog v-model="isRoomEditorOpen" max-width="600" persistent>
    <room-editor
      :room-group-id="roomGroupId"
      :room="room"
      @save="handleUpdateRoom"
      @cancel="isRoomEditorOpen = false"
    />
  </v-dialog>
  <v-dialog v-model="isDeleteModalOpen" max-width="400" persistent>
    <v-card title="部屋の削除">
      <v-card-text> この部屋を削除しますか？ </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="isDeleteModalOpen = false">キャンセル</v-btn>
        <v-btn color="error" @click="handleDeleteRoom">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
