<script setup lang="ts">
import AddStaffDialogButton from '@/components/TopView/AddStaffDialogButton.vue'
import DeleteStaffDialogButton from '@/components/TopView/DeleteStaffDialogButton.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import { ref, onMounted } from 'vue'
type User = components['schemas']['UserResponse']
const staffs = ref<User[]>([])
const fetchStaffs = async () => {
  const { data, error } = await apiClient.GET('/api/staffs')
  if (error) {
    return []
  }
  return data
}
onMounted(async () => {
  staffs.value = await fetchStaffs()
})
</script>

<template>
  <v-card>
    <v-row>
      <v-col class="text-center">
        <h2>スタッフ一覧</h2>
      </v-col>
      <v-col class="flex-grow-0">
        <AddStaffDialogButton :staffs="staffs" />
      </v-col>
    </v-row>
    <v-list>
      <v-divider />
      <v-list-item v-for="staff in staffs" :key="staff.id">
        <v-list-title>@{{ staff.id }}</v-list-title>
        <template v-slot:prepend>
          <v-avatar>
            <v-img :src="'https://q.trap.jp/api/v3/public/icon/' + staff.id" />
          </v-avatar>
        </template>
        <template v-slot:append>
          <DeleteStaffDialogButton :deleteStaffTarget="staff.id" :staffs="staffs" />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>
