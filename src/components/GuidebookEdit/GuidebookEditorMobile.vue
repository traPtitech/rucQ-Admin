<script setup lang="ts">
import { ref } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { convertMarkdownToSafeHtml } from '@/utils/markdownConverter'

const props = defineProps<{
  guidebook: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'update', updatedGuidebook: string): void
}>()

const editingGuidebook = ref<string>(props.guidebook)
const mode = ref<'edit' | 'preview'>('edit')
</script>

<template>
  <div>
    <div v-if="mode === 'edit'">
      <section-title title="編集">
        <template #actions>
          <v-btn
            prepend-icon="mdi-eye"
            text="preview"
            color="secondary"
            variant="outlined"
            density="comfortable"
            @click="mode = 'preview'"
          />
        </template>
      </section-title>
      <section-card>
        <v-textarea
          v-model="editingGuidebook"
          placeholder="# 20XX年度 夏合宿"
          rows="10"
          auto-grow
        />
      </section-card>
    </div>
    <div v-else>
      <section-title title="プレビュー">
        <template #actions>
          <v-btn
            prepend-icon="mdi-pencil"
            text="edit"
            color="secondary"
            variant="outlined"
            density="comfortable"
            @click="mode = 'edit'"
          />
        </template>
      </section-title>
      <section-card>
        <div v-html="convertMarkdownToSafeHtml(editingGuidebook)" class="markdown-body"></div>
      </section-card>
    </div>
    <div class="d-flex ga-2 mt-2">
      <v-spacer />
      <v-btn variant="outlined" @click="emit('cancel')"> キャンセル </v-btn>
      <v-btn color="primary" @click="emit('update', editingGuidebook)"> 保存 </v-btn>
    </div>
  </div>
</template>
