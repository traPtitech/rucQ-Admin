<script setup lang="ts">
import { computed, ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import { onMounted } from 'vue'

type Camp = components['schemas']['CampResponse']
type User = components['schemas']['UserResponse']

const fetchCamps = async () => {
  const { data, error } = await apiClient.GET('/api/camps')
  if (error) {
    return []
  }
  return data
}
const fetchStaffs = async () => {
  const { data, error } = await apiClient.GET('/api/staffs')
  if (error) {
    return []
  }
  return data
}

const camps = ref<Camp[]>([])
const staffs = ref<User[]>([])
onMounted(async () => {
  camps.value = await fetchCamps()
  staffs.value = await fetchStaffs()
})
const pastCamps = computed(() => {
  return camps.value.filter((camp) => new Date(camp.dateEnd) < new Date())
})
const plannedCamps = computed(() => {
  console.log(camps.value)
  return camps.value.filter((camp) => new Date(camp.dateStart) >= new Date())
})

const deleteStaff = async () => {
  if (!deleteStaffTarget.value) {
    return
  }
  const { error } = await apiClient.PUT(`/api/admin/users/{userId}`, {
    params: {
      path: {
        userId: deleteStaffTarget.value,
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
  staffs.value = staffs.value.filter((staff) => staff.id !== deleteStaffTarget.value)
  deleteStaffDialog.value = false
  deleteStaffTarget.value = undefined
}
const deleteStaffDialog = ref(false)
const deleteStaffTarget = ref<string | undefined>()
</script>

<template>
  <v-container>
    <h1>合宿Adminトップ</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <h2 class="pl-4">予定された合宿</h2>
            <v-card v-for="camp in plannedCamps" :key="camp.id" class="ma-4">
              <v-card-title>{{ camp.name }}</v-card-title>
              <v-card-subtitle>{{ camp.dateStart }} 〜 {{ camp.dateEnd }}</v-card-subtitle>
              <v-card-text>{{ camp.description }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" :to="`/${camp.displayId}`">詳細</v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
          <v-card>
            <h2 class="pl-4">以前の合宿</h2>
            <v-card v-for="camp in pastCamps" :key="camp.id" class="ma-4">
              <v-card-title>{{ camp.name }}</v-card-title>
              <v-card-subtitle>{{ camp.dateStart }} 〜 {{ camp.dateEnd }}</v-card-subtitle>
              <v-card-text>{{ camp.description }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary" :to="`/${camp.displayId}`">詳細</v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <h2 class="pl-4">スタッフ一覧</h2>
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
                  <v-btn
                    @click="((deleteStaffTarget = staff.id), (deleteStaffDialog = true))"
                    color="red"
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <v-dialog v-model="deleteStaffDialog" max-width="500px">
    <v-card>
      <v-card-title>スタッフ削除</v-card-title>
      <v-card-text>本当にこのスタッフを削除しますか？</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="((deleteStaffTarget = undefined), (deleteStaffDialog = false))"
          >キャンセル</v-btn
        >
        <v-btn @click="deleteStaff" color="red">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style module></style>
