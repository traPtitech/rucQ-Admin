<script setup lang="ts">
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
const { deleteStaffTarget } = defineProps<{
  deleteStaffTarget: string
}>()
const staffs = defineModel<User[]>('staffs', { required: true })

const deleteStaff = async () => {
  if (!deleteStaffTarget) {
    return
  }
  const { error } = await apiClient.PUT('/api/admin/users/{userId}', {
    params: {
      path: {
        userId: deleteStaffTarget,
      },
    },
    body: {
      isStaff: false,
    },
  })
  if (error) {
    console.error('スタッフの削除に失敗しました:', error)
    return
  }
  staffs.value.splice(
    staffs.value.findIndex((staff) => staff.id === deleteStaffTarget),
    1,
  )
}
</script>

<template>
  <v-dialog max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <template v-slot="{ isActive }">
      <v-card>
        <v-card-title>スタッフ削除</v-card-title>
        <v-card-text>本当にこのスタッフを削除しますか？</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isActive.value = false">キャンセル</v-btn>
          <v-btn @click="((isActive.value = false), deleteStaff())" color="red">削除</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
