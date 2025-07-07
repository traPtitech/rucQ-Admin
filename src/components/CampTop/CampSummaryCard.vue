<script setup lang="ts">
import { parseISO, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { components } from '@/api/schema'

defineProps<{
  camp?: components['schemas']['CampResponse']
}>()

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d(EEEEE)', { locale: ja })
}
</script>

<template>
  <div>
    <h2 class="font-weight-regular">概要</h2>
    <v-sheet v-if="camp" elevation="2" class="pa-4">
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
  </div>
</template>
