<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isNewEvent: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'delete'): void
  (e: 'save'): void
}>()

const isDeleteModalOpen = ref(false)
const isSaveModalOpen = ref(false)

const handleDelete = () => {
  isDeleteModalOpen.value = false
  emit('delete')
}
const handleSave = () => {
  isSaveModalOpen.value = false
  emit('save')
}
</script>

<template>
  <div class="d-flex ga-2">
    <v-spacer />
    <v-btn variant="outlined" @click="emit('cancel')"> キャンセル </v-btn>
    <v-btn v-if="!isNewEvent" color="error" @click="isDeleteModalOpen = true"> 削除 </v-btn>
    <v-btn color="primary" @click="isSaveModalOpen = true"> 保存 </v-btn>
  </div>
  <v-dialog v-model="isDeleteModalOpen" max-width="400">
    <v-card title="イベントの削除">
      <v-card-text>
        本当にこのイベントを削除しますか？<br />この操作は元に戻せません。
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isDeleteModalOpen = false">キャンセル</v-btn>
        <v-btn color="error" @click="handleDelete">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isSaveModalOpen" max-width="400">
    <v-card title="編集内容の保存">
      <v-card-text> 編集内容を保存しますか？ </v-card-text>
      <v-card-actions>
        <v-btn text @click="isSaveModalOpen = false">キャンセル</v-btn>
        <v-btn color="primary" @click="handleSave">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
