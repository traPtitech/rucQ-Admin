<script setup lang="ts">
import CampSummaryCard from '@/components/CampTop/CampSummaryCard.vue'
import GuidebookCard from '@/components/CampTop/GuidebookCard.vue'
import type { components } from '@/api/schema'
import {
  useCurrentCampQuery,
  useParticipantsQuery,
  useUpdateCampMutation,
} from '@/api/queries/camps'

const { data: camp } = useCurrentCampQuery()
const { data: participants } = useParticipantsQuery()
const { mutate: updateCamp } = useUpdateCampMutation()

const handleUpdate = (updatedCamp: components['schemas']['CampRequest']) => {
  if (!camp.value) return
  updateCamp({ campId: camp.value.id, updatedCamp })
}
</script>

<template>
  <v-container>
    <CampSummaryCard :camp="camp" :participants="participants" @update="handleUpdate" />
    <GuidebookCard :camp="camp" />
  </v-container>
</template>
