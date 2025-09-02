<script setup lang="ts">
import { ref } from 'vue'
import type { components } from '@/api/schema'
import type { VForm } from 'vuetify/components'
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']

const props = defineProps<{
  roomGroup?: RoomGroup
}>()

const emit = defineEmits<{
  (e: 'save', roomGroup: RoomGroupRequest): void
  (e: 'cancel'): void
}>()

const formRef = ref<VForm | null>(null)
const roomGroupName = ref<string>(props.roomGroup?.name ?? '')

const required = (v: string | undefined) => !!v || '必須項目です'

const handleSave = () => {
  if (!formRef.value?.isValid) return
  emit('save', { name: roomGroupName.value })
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="handleSave">
    <v-card :title="roomGroup ? '部屋グループの編集' : '部屋グループの作成'">
      <div class="px-4">
        <v-text-field v-model="roomGroupName" label="部屋グループ名" :rules="[required]" />
      </div>
      <v-card-actions>
        <v-btn @click="emit('cancel')">キャンセル</v-btn>
        <v-btn type="submit" color="primary">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
