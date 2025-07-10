<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
const staffs = defineModel<User[]>('staffs', { required: true })
const addStaffTarget = ref<string>('')
const addStaff = async () => {
  if (!addStaffTarget.value) {
    return
  }
  const { error } = await apiClient.PUT('/api/admin/users/{userId}', {
    params: {
      path: {
        userId: addStaffTarget.value,
      },
    },
    body: {
      isStaff: true,
    },
  })
  if (error) {
    console.error('スタッフの追加に失敗しました:', error)
    return
  }
  staffs.value.push({
    id: addStaffTarget.value,
    isStaff: true,
  } as User)
  addStaffTarget.value = ''
}
</script>

<template>
  <v-dialog max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>スタッフ追加</v-card-title>
        <v-card-text>
          <v-text-field v-model="addStaffTarget" label="ユーザーID" prefix="@" placeholder="traP" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="isActive.value = false">キャンセル</v-btn>
          <v-btn @click="((isActive.value = false), addStaff())" color="primary">追加</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
