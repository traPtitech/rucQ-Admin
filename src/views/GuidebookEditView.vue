<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import GuidebookEditorDesktop from '@/components/GuidebookEdit/GuidebookEditorDesktop.vue'
import GuidebookEditorMobile from '@/components/GuidebookEdit/GuidebookEditorMobile.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const router = useRouter()
const display = useDisplay()
const campname = route.params.campname as string
const isLgAndUp = display.lgAndUp

const camp = ref<components['schemas']['CampResponse']>()

const fetchCamp = async () => {
  if (!campname) return
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((c) => c.displayId === campname)
}

onMounted(async () => {
  camp.value = await fetchCamp()
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
  <v-container v-if="camp">
    <guidebook-editor-desktop
      v-if="isLgAndUp"
      :guidebook="camp.guidebook"
      @cancel="goToCampTop"
      @update="handleUpdate"
    />
    <guidebook-editor-mobile
      v-else
      :guidebook="camp.guidebook"
      @cancel="goToCampTop"
      @update="handleUpdate"
    />
  </v-container>
</template>
