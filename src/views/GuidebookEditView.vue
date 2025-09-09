<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import GuidebookEditorDesktop from '@/components/GuidebookEdit/GuidebookEditorDesktop.vue'
import GuidebookEditorMobile from '@/components/GuidebookEdit/GuidebookEditorMobile.vue'
import { useCurrentCampQuery, useUpdateCampMutation } from '@/api/queries/camps'
import type { components } from '@/api/schema'
type CampRequest = components['schemas']['CampRequest']

const { data: camp } = useCurrentCampQuery()
const { mutate: updateCamp } = useUpdateCampMutation()

const router = useRouter()
const display = useDisplay()
const isLgAndUp = display.lgAndUp

const handleUpdate = async (updatedGuidebook: string) => {
  if (!camp.value) return
  const updatedCamp: CampRequest = {
    ...camp.value,
    guidebook: updatedGuidebook,
  }
  updateCamp({ campId: camp.value.id, updatedCamp })
  goToCampTop()
}

const goToCampTop = () => {
  if (!camp.value) return
  router.push({ name: 'CampTop', params: { campname: camp.value.displayId } })
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
