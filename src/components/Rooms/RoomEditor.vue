<script setup lang="ts">
import { ref } from 'vue'
import type { components } from '@/api/schema'
import type { VForm } from 'vuetify/components'
type Room = components['schemas']['RoomResponse']
type RoomRequest = components['schemas']['RoomRequest']

const props = defineProps<{
  roomGroupId: number
  room?: Room
}>()

const emit = defineEmits<{
  (e: 'save', room: RoomRequest): void
  (e: 'cancel'): void
}>()

const formRef = ref<VForm | null>(null)
const name = ref<string>(props.room?.name ?? '')
const memberIds = ref<string>(props.room?.members.map((user) => `@${user.id}`).join(' ') ?? '')

const required = (v: string | undefined) => !!v || '必須項目です'

const handleSave = () => {
  if (!formRef.value?.isValid) return
  const room: RoomRequest = {
    name: name.value,
    roomGroupId: props.roomGroupId,
    memberIds: memberIds.value
      .split(' ')
      .map((id) => id.replace(/^@/, ''))
      .filter((id) => id !== ''),
  }
  emit('save', room)
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="handleSave">
    <v-card :title="room ? '部屋の編集' : '部屋の作成'">
      <div class="d-flex flex-column ga-1 px-4">
        <v-text-field v-model="name" label="部屋名" :rules="[required]" />
        <v-text-field v-model="memberIds" label="メンバー" />
      </div>
      <v-card-actions>
        <v-btn @click="emit('cancel')">キャンセル</v-btn>
        <v-btn type="submit" color="primary">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
