<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'registration', userId: string): void
}>()

const userId = ref<string>()
const isModalOpen = ref(false)

const handleRegistration = () => {
  if (!userId.value) return
  emit('registration', userId.value)
  isModalOpen.value = false
}

watch(isModalOpen, (isOpen) => {
  if (!isOpen) {
    userId.value = ''
  }
})
</script>

<template>
  <div class="d-flex flex-column align-center ga-4 mt-8">
    <div class="text-h5 text-medium-emphasis">ユーザー未選択</div>
    <v-btn
      class="flex-grow-1"
      prepend-icon="mdi-plus"
      color="secondary"
      variant="outlined"
      max-width="300"
      @click="isModalOpen = true"
    >
      参加登録
    </v-btn>
  </div>
  <v-dialog v-model="isModalOpen" max-width="600">
    <v-card title="参加登録">
      <v-card-text class="pb-2">
        <p>
          参加登録をすると、本人にDMで通知されます。<br />
          トラブル防止のため、必ず本人の了解を得てから操作してください。
        </p>
      </v-card-text>
      <v-text-field v-model="userId" class="px-6 pb-4" label="traQ ID" hide-details />
      <v-card-actions>
        <v-btn text @click="isModalOpen = false">キャンセル</v-btn>
        <v-btn color="primary" :disabled="!userId" @click="handleRegistration"> 登録 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
