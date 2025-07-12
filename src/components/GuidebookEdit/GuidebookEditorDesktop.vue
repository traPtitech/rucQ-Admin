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
</script>

<template>
  <div>
    <v-row>
      <v-col cols="6">
        <section-title title="編集" />
        <section-card>
          <v-textarea
            v-model="editingGuidebook"
            placeholder="# 20XX年度 夏合宿"
            rows="10"
            auto-grow
          />
        </section-card>
      </v-col>
      <v-col cols="6">
        <section-title title="プレビュー" />
        <section-card>
          <div v-if="!!editingGuidebook">
            <div v-html="convertMarkdownToSafeHtml(editingGuidebook)" class="markdown-body"></div>
          </div>
          <div v-else>
            <p class="text-medium-emphasis">合宿のしおりはまだ作成されていません</p>
          </div>
        </section-card>
      </v-col>
    </v-row>
    <div class="d-flex ga-2 mt-2">
      <v-spacer />
      <v-btn variant="outlined" @click="emit('cancel')"> キャンセル </v-btn>
      <v-btn color="primary" @click="emit('update', editingGuidebook)"> 保存 </v-btn>
    </div>
  </div>
</template>
