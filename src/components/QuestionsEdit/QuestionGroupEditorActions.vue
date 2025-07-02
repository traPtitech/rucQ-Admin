<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const isSaveModalOpen = defineModel<boolean>('isSaveModalOpen', { required: true })
const isErrorModalOpen = defineModel<boolean>('isErrorModalOpen', { required: true })

defineProps<{
  isNewQuestionGroup: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'cancel'): void
  (e: 'delete'): void
  (e: 'validate'): void
  (e: 'save'): void
}>()

const display = useDisplay()
const isSmAndUp = display.smAndUp

const isDeleteModalOpen = ref(false)
</script>

<template>
  <div>
    <div v-if="!isSmAndUp" class="mb-2">
      <div class="d-flex justify-center mb-4">
        <v-btn prepend-icon="mdi-plus" color="secondary" @click="emit('create')">
          質問を追加
        </v-btn>
      </div>
      <v-divider />
    </div>
    <div class="d-flex align-center">
      <v-btn v-if="isSmAndUp" prepend-icon="mdi-plus" color="secondary" @click="emit('create')">
        質問を追加
      </v-btn>
      <div class="d-flex align-self-end justify-end flex-grow-1 ga-2">
        <v-btn variant="outlined" @click="emit('cancel')"> キャンセル </v-btn>
        <v-btn color="error" @click="isDeleteModalOpen = true"> 削除 </v-btn>
        <v-btn color="primary" @click="emit('validate')"> 保存 </v-btn>
      </div>
    </div>
  </div>
  <v-dialog v-model="isDeleteModalOpen" max-width="400">
    <v-card title="質問グループの削除">
      <v-card-text>
        本当にこの質問グループを削除しますか？<br />この操作は元に戻せません。
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isDeleteModalOpen = false">キャンセル</v-btn>
        <v-btn color="error" @click="emit('delete')">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isSaveModalOpen" max-width="400">
    <v-card title="編集内容の保存">
      <v-card-text>
        編集内容を保存しますか？<br />
        新規作成した質問のタイプ、回答の公開範囲はあとから変更できません。
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isSaveModalOpen = false">キャンセル</v-btn>
        <v-btn color="primary" @click="emit('save')">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isErrorModalOpen" max-width="400">
    <v-card title="入力内容の確認">
      <v-card-text> 入力内容に誤りがあります。すべての項目を正しく入力してください。 </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="isErrorModalOpen = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
