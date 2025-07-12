<script setup lang="ts">
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import AddStaffDialogButton from '@/components/TopView/AddStaffDialogButton.vue'
import DeleteStaffDialogButton from '@/components/TopView/DeleteStaffDialogButton.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
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
  <div>
    <section-title title="スタッフ一覧">
      <template #actions>
        <AddStaffDialogButton :staffs="staffs" />
      </template>
    </section-title>
    <section-card>
      <v-list class="ma-n2">
        <template v-for="staff in staffs" :key="staff.id">
          <v-list-item class="py-2">
            <v-list-title>@{{ staff.id }}</v-list-title>
            <template v-slot:prepend>
              <UserAvatar :trapId="staff.id" />
            </template>
            <template v-slot:append>
              <DeleteStaffDialogButton :deleteStaffTarget="staff.id" :staffs="staffs" />
            </template>
          </v-list-item>
        </template>
      </v-list>
    </section-card>
  </div>
</template>
