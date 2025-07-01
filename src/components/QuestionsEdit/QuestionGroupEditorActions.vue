<script setup lang="ts">
defineProps<{
  isNewQuestionGroup: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'cancel'): void
  (e: 'delete'): void
  (e: 'save'): void
}>()
</script>

<template>
  <div class="d-flex justify-space-between align-center flex-wrap">
    <v-btn class="mt-2" prepend-icon="mdi-plus" color="secondary" @click="emit('create')">
      質問を追加
    </v-btn>
    <div class="d-flex ga-2 align-self-end mt-2">
      <v-btn variant="outlined" @click="emit('cancel')"> キャンセル </v-btn>
      <v-dialog v-if="!isNewQuestionGroup" max-width="400">
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="error"> 削除 </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card title="質問グループの削除">
            <v-card-text>
              本当にこの質問グループを削除しますか？この操作は元に戻せません。
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="isActive.value = false">キャンセル</v-btn>
              <v-btn color="error" @click="emit('delete')">削除</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog max-width="400">
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary"> 保存 </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card title="編集内容の保存">
            <v-card-text> 変更内容を保存しますか？ </v-card-text>
            <v-card-actions>
              <v-btn text @click="isActive.value = false">キャンセル</v-btn>
              <v-btn color="primary" @click="emit('save')">保存</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </div>
</template>
