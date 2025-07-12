<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import { parseISO, isValid } from 'date-fns'
import { VForm } from 'vuetify/components'
type CampRequest = components['schemas']['CampRequest']

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const defaultCamp: CampRequest = {
  name: '',
  guidebook: '',
  dateStart: '',
  dateEnd: '',
  displayId: '',
  isDraft: true,
  isPaymentOpen: false,
  isRegistrationOpen: false,
}
const addCampTarget = ref<CampRequest>(defaultCamp)

const addCamp = async () => {
  const { error } = await apiClient.POST('/api/admin/camps', {
    body: addCampTarget.value,
  })
  if (error) {
    console.error('合宿の追加に失敗しました:', error)
    return
  }
  emit('submit')
  addCampTarget.value = defaultCamp
}

const campRules = {
  required: (value: string) => !!value || '必須項目です',
  date: (value: string) => isValid(parseISO(value)) || '日付はYYYY-MM-DD形式で入力してください',
}
const form = ref<VForm | null>()
const validate = async () => {
  return (await form.value?.validate())?.valid ?? false
}
</script>

<template>
  <v-dialog max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" class="mr-2" icon size="medium" variant="plain">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>合宿追加</v-card-title>
        <v-form ref="form" @submit.prevent>
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
              :rules="[campRules.date, campRules.required]"
            />
            <v-text-field
              v-model="addCampTarget.dateEnd"
              label="終了日"
              type="date"
              placeholder="YYYY-MM-DD"
              :rules="[campRules.date, campRules.required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="isActive.value = false">キャンセル</v-btn>
            <v-btn
              @click="validate().then((b: boolean) => b && (addCamp(), (isActive.value = false)))"
              color="primary"
            >
              追加
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
</template>
