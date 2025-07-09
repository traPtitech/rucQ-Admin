<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { isAfter, isEqual, isValid, parseISO } from 'date-fns'
import type { components } from '@/api/schema'
type CampRequest = components['schemas']['CampRequest']

const props = defineProps<{
  camp: CampRequest
}>()

const emit = defineEmits<{
  (e: 'update', camp: CampRequest): void
}>()

// バリデーション
const required = (v: string | undefined) => !!v || '必須項目です'
const date = (v: string | undefined) => {
  if (!v) return '必須項目です'
  return isValid(parseISO(v)) || '無効な日付です'
}
const endAfterStart = (startDate: string | undefined) => (v: string | undefined) => {
  if (!v || !startDate) return true
  const end = parseISO(v)
  const start = parseISO(startDate)
  return isAfter(end, start) || isEqual(end, start) || '終了日は開始日の前に設定できません'
}

const form = ref<VForm | null>(null)
const editedCamp = ref<CampRequest>({ ...props.camp })

watch(
  () => editedCamp.value.isDraft,
  (isDraft) => {
    if (isDraft) {
      editedCamp.value.isRegistrationOpen = false
      editedCamp.value.isPaymentOpen = false
    }
  },
)
watch(
  () => editedCamp.value.isRegistrationOpen,
  (isRegistrationOpen) => {
    if (isRegistrationOpen) {
      editedCamp.value.isPaymentOpen = false
    }
  },
)
</script>

<template>
  <v-form ref="form" @submit.prevent="emit('update', editedCamp)">
    <v-card title="合宿情報の編集">
      <div class="d-flex flex-column px-4 ga-1">
        <v-text-field
          v-model="editedCamp.displayId"
          label="合宿ID"
          placeholder="XXsummer"
          hint="合宿IDを変更すると、合宿のURLも変更されます"
          :rules="[required]"
          required
        />
        <v-text-field
          v-model="editedCamp.name"
          label="合宿名"
          placeholder="20XX年度夏合宿"
          :rules="[required]"
          required
        />
        <v-text-field
          v-model="editedCamp.dateStart"
          label="開始日"
          type="date"
          :rules="[required, date]"
          required
        />
        <v-text-field
          v-model="editedCamp.dateEnd"
          label="終了日"
          type="date"
          :rules="[required, date, endAfterStart(editedCamp.dateStart)]"
          required
        />
        <v-checkbox
          v-model="editedCamp.isDraft"
          label="合宿を下書きとして設定する"
          color="primary"
          density="compact"
          hide-details
        />
        <v-checkbox
          v-model="editedCamp.isRegistrationOpen"
          label="参加登録を受け付ける"
          color="primary"
          density="compact"
          :disabled="editedCamp.isDraft"
          hide-details
        />
        <v-checkbox
          v-model="editedCamp.isPaymentOpen"
          label="合宿費の振込期間中として設定する"
          color="primary"
          density="compact"
          :disabled="editedCamp.isDraft || editedCamp.isRegistrationOpen"
          hide-details
        />
      </div>
      <v-card-actions>
        <v-btn color="primary" type="submit">更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
