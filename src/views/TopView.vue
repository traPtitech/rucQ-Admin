<script setup lang="ts">
import { computed, ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import { onMounted } from 'vue'

type Camp = components['schemas']['CampResponse']
type CampRequest = components['schemas']['CampRequest']
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

const addStaffDialog = ref(false)
const addStaffTarget = ref<string | undefined>()
const addStaff = async () => {
  if (!addStaffTarget.value) {
    return
  }
  const { error } = await apiClient.PUT(`/api/admin/users/{userId}`, {
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
  addStaffDialog.value = false
  addStaffTarget.value = undefined
}

const addCampDialog = ref(false)
const addCampTarget = ref<CampRequest>({
  displayId: '',
  name: '',
  dateStart: '',
  dateEnd: '',
  description: '',
} as CampRequest)
const addCamp = async () => {
  if (!addCampTarget.value.displayId) {
    return
  }
  const { error } = await apiClient.POST('/api/admin/camps', {
    body: addCampTarget.value,
  })
  if (error) {
    console.error('合宿の追加に失敗しました:', error)
    return
  }
  camps.value = await fetchCamps()
  addCampDialog.value = false
  addCampTarget.value = {
    displayId: '',
    name: '',
    dateStart: '',
    dateEnd: '',
    description: '',
  } as CampRequest
}

const campRules = {
  required: (value: string) => !!value || '必須項目です',
  date: (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) || '日付はYYYY-MM-DD形式で入力してください',
}
</script>

<template>
  <v-container>
    <h1>合宿Adminトップ</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-row>
              <v-col class="text-center">
                <h2>合宿一覧</h2>
              </v-col>
              <v-col class="flex-grow-0">
                <v-btn icon @click="addCampDialog = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-card class="mb-4">
              <h3 class="pl-4">予定された合宿</h3>
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
              <h3 class="pl-4">以前の合宿</h3>
              <v-card v-for="camp in pastCamps" :key="camp.id" class="ma-4">
                <v-card-title>{{ camp.name }}</v-card-title>
                <v-card-subtitle>{{ camp.dateStart }} 〜 {{ camp.dateEnd }}</v-card-subtitle>
                <v-card-text>{{ camp.description }}</v-card-text>
                <v-card-actions>
                  <v-btn color="primary" :to="`/${camp.displayId}`">詳細</v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-row>
              <v-col class="text-center">
                <h2>スタッフ一覧</h2>
              </v-col>
              <v-col class="flex-grow-0">
                <v-btn @click="addStaffDialog = true" icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
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
  <v-dialog v-model="addCampDialog" max-width="500px">
    <v-card>
      <v-card-title>合宿追加</v-card-title>
      <v-form>
        <v-card-text>
          <v-text-field
            v-model="addCampTarget.displayId"
            label="表示ID"
            placeholder="合宿の表示ID"
            :rules="[campRules.required]"
          />
          <v-text-field
            v-model="addCampTarget.name"
            label="合宿名"
            placeholder="合宿の名前"
            :rules="[campRules.required]"
          />
          <v-text-field
            v-model="addCampTarget.dateStart"
            label="開始日"
            type="date"
            placeholder="YYYY-MM-DD"
            :rules="[campRules.required, campRules.date]"
          />
          <v-text-field
            v-model="addCampTarget.dateEnd"
            label="終了日"
            type="date"
            placeholder="YYYY-MM-DD"
            :rules="[campRules.required, campRules.date]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addCampDialog = false">キャンセル</v-btn>
          <v-btn @click="addCamp" color="primary" type="submit">追加</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
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
  <v-dialog v-model="addStaffDialog" max-width="500px">
    <v-card>
      <v-card-title>スタッフ追加</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="addStaffTarget"
          label="ユーザーID"
          placeholder="追加するユーザーのID"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="((addStaffTarget = undefined), (addStaffDialog = false))">キャンセル</v-btn>
        <v-btn @click="addStaff" color="primary">追加</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style module></style>
