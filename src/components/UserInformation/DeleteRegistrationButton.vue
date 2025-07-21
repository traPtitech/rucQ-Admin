<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

const isModalOpen = ref(false)

const handleDelete = () => {
  isModalOpen.value = false
  emit('delete')
}
</script>

<template>
  <v-btn
    color="error"
    class="flex-grow-1"
    prepend-icon="mdi-delete"
    max-width="300"
    @click="isModalOpen = true"
  >
    参加登録の削除
  </v-btn>
  <v-dialog v-model="isModalOpen" max-width="600">
    <v-card title="参加登録の削除">
      <v-card-text>
        <p>
          本当に@{{ userId }}の参加登録を削除しますか？<br />
          この操作は元に戻せません。
        </p>
        <p>
          参加登録を削除すると、@{{ userId }}にDMで通知されます。<br />
          トラブル防止のため、必ず本人の了解を得てから操作してください。
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isModalOpen = false">キャンセル</v-btn>
        <v-btn color="error" @click="handleDelete">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
