<script setup lang="ts">
import { ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import CampSummaryEditor from '@/components/CampTop/CampSummaryEditor.vue'
import type { components } from '@/api/schema'

defineProps<{
  camp?: components['schemas']['CampResponse']
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
    <v-sheet v-if="camp" class="pa-4" elevation="2">
      <div class="mb-2">
        <h1>{{ camp.name }}</h1>
        <p>{{ formatDate(camp.dateStart) }} - {{ formatDate(camp.dateEnd) }}</p>
      </div>
      <div>
        <p v-if="camp.isDraft">この合宿は現在下書きに設定されています</p>
        <p v-if="camp.isRegistrationOpen">この合宿は現在参加登録を受け付けています</p>
        <p v-if="camp.isPaymentOpen">この合宿は現在参加費の振込期間中です</p>
      </div>
    </v-sheet>
    <v-sheet v-else class="pa-4" elevation="2">
      <p class="text-medium-emphasis">合宿の取得に失敗しました</p>
    </v-sheet>
  </div>
  <v-dialog v-if="camp" v-model="dialog" max-width="600">
    <CampSummaryEditor :camp="camp" @update="handleUpdate" />
  </v-dialog>
</template>
