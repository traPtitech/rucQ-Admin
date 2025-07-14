<script setup lang="ts">
import { ref } from 'vue'
import ContentCard from '@/components/shared/ContentCard.vue'

defineProps<{
  questionTitle: string
  AnswerExists: boolean
  isEditing: boolean
  userId: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'cancel'): void
  (e: 'save'): void
}>()

const isModalOpen = ref(false)

const handleSave = () => {
  isModalOpen.value = false
  emit('save')
}
</script>

<template>
  <content-card :border-color="isEditing ? 'secondary' : 'primary'" :elevation="isEditing ? 4 : 2">
    <div class="d-flex mb-1">
      <div class="d-flex align-end ga-2">
        <h3>{{ questionTitle }}</h3>
        <div v-if="!AnswerExists && !isEditing" class="text-body-1 text-medium-emphasis">
          (未回答)
        </div>
      </div>
      <v-spacer />
      <v-btn
        v-if="!isEditing"
        icon="mdi-pencil"
        size="small"
        density="comfortable"
        variant="plain"
        @click="emit('edit')"
      />
    </div>
    <slot />
    <div v-if="isEditing" class="d-flex ga-2">
      <v-spacer />
      <v-btn variant="outlined" @click="emit('cancel')">キャンセル</v-btn>
      <v-btn color="primary" :disabled="!AnswerExists" @click="isModalOpen = true">保存</v-btn>
    </div>
  </content-card>
  <v-dialog v-model="isModalOpen" max-width="600">
    <v-card title="回答の保存">
      <v-card-text>
        回答を編集すると、@{{ userId }} にDMで通知されます。<br />
        トラブル防止のため、必ず本人の了解を得てから編集してください。 <br />
        編集を保存しますか？
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isModalOpen = false">キャンセル</v-btn>
        <v-btn color="primary" @click="handleSave">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
