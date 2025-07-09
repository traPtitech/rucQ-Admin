<script setup lang="ts">
import { ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import CampNotifications from '@/components/CampTop/CampNotifications.vue'
import CampSummaryEditor from '@/components/CampTop/CampSummaryEditor.vue'
import type { components } from '@/api/schema'

defineProps<{
  camp?: components['schemas']['CampResponse']
  participants?: components['schemas']['UserResponse'][]
}>()

const emit = defineEmits<{
  (e: 'update', camp: components['schemas']['CampRequest']): void
}>()

const dialog = ref(false)

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d(EEEEE)', { locale: ja })
}

const handleUpdate = (updatedCamp: components['schemas']['CampRequest']) => {
  dialog.value = false
  emit('update', updatedCamp)
}
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <h2 class="font-weight-regular">概要</h2>
      <v-spacer />
      <v-btn
        v-if="camp"
        class="mr-2"
        icon="mdi-pencil"
        size="medium"
        variant="plain"
        @click="dialog = true"
      />
    </div>
    <v-sheet v-if="camp" class="d-flex flex-column ga-2 pa-4" elevation="2">
      <h1>{{ camp.name }}</h1>
      <div>
        <div class="text-body-2">開催日</div>
        <div class="text-h5">{{ formatDate(camp.dateStart) }} - {{ formatDate(camp.dateEnd) }}</div>
      </div>
      <div>
        <div class="text-body-2">参加人数</div>
        <div class="text-h5">{{ participants?.length }}</div>
      </div>
      <div>
        <div class="text-body-2">参加者</div>
        <div class="flex flex-wrap">
          <router-link
            v-for="participant in participants"
            :key="participant.id"
            :to="{
              name: 'UserInformation',
              params: { campname: camp.displayId },
              query: { id: participant.id },
            }"
          >
            <v-avatar size="small">
              <v-img
                :src="`https://q.trap.jp/api/v3/public/icon/${participant.id}`"
                :alt="participant.id"
              />
            </v-avatar>
          </router-link>
        </div>
      </div>
      <camp-notifications :camp="camp" />
    </v-sheet>
    <v-sheet v-else class="pa-4" elevation="2">
      <p class="text-medium-emphasis">合宿の取得に失敗しました</p>
    </v-sheet>
  </div>
  <v-dialog v-if="camp" v-model="dialog" max-width="600">
    <CampSummaryEditor :camp="camp" @update="handleUpdate" />
  </v-dialog>
</template>
