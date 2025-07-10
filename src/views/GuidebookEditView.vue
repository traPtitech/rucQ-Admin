<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import GuidebookPreviewCard from '@/components/GuidebookEdit/GuidebookPreviewCard.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const router = useRouter()
const display = useDisplay()
const campname = route.params.campname as string
const isLgAndUp = display.lgAndUp

const camp = ref<components['schemas']['CampResponse']>()
const guidebook = ref<string>('')
const mode = ref<'edit' | 'preview'>('edit')

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}

onMounted(async () => {
  camp.value = await fetchCamp()
  guidebook.value = camp.value?.guidebook ?? ''
})

const handleUpdate = async (updatedGuidebook: string) => {
  if (!camp.value) return
  const updatedCamp: components['schemas']['CampRequest'] = {
    ...camp.value,
    guidebook: updatedGuidebook,
  }
  const { error } = await apiClient.PUT('/api/admin/camps/{campId}', {
    params: { path: { campId: camp.value.id } },
    body: updatedCamp,
  })
  if (error) return
  goToCampTop()
}

const goToCampTop = () => {
  router.push({ name: 'CampTop', params: { campname: campname } })
}
</script>

<template>
  <v-container>
    <v-row v-if="isLgAndUp">
      <v-col cols="6">
        <h2 class="font-weight-regular">編集</h2>
        <v-sheet class="pa-4" elevation="2">
          <v-textarea v-model="guidebook" placeholder="# 20XX年度 夏合宿" rows="10" auto-grow />
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <h2 class="font-weight-regular">プレビュー</h2>
        <guidebook-preview-card :guidebook="guidebook" />
      </v-col>
    </v-row>
    <div v-else>
      <div v-if="mode === 'edit'">
        <div class="d-flex align-center mb-1">
          <h2 class="font-weight-regular">編集</h2>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-eye"
            text="preview"
            color="secondary"
            variant="outlined"
            density="comfortable"
            @click="mode = 'preview'"
          />
        </div>
        <v-sheet class="pa-4" elevation="2">
          <v-textarea v-model="guidebook" placeholder="# 20XX年度 夏合宿" rows="10" auto-grow />
        </v-sheet>
      </div>
      <div v-else>
        <div class="d-flex align-center mb-1">
          <h2 class="font-weight-regular">プレビュー</h2>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-pencil"
            text="edit"
            color="secondary"
            variant="outlined"
            density="comfortable"
            @click="mode = 'edit'"
          />
        </div>
        <guidebook-preview-card :guidebook="guidebook" />
      </div>
    </div>
    <div class="d-flex ga-2 mt-2">
      <v-spacer />
      <v-btn variant="outlined" @click="goToCampTop"> キャンセル </v-btn>
      <v-btn color="primary" @click="handleUpdate(guidebook)"> 保存 </v-btn>
    </div>
  </v-container>
</template>
