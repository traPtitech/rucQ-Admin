<script setup lang="ts">
import CampSummaryCard from '@/components/CampTop/CampSummaryCard.vue'
import GuidebookCard from '@/components/CampTop/GuidebookCard.vue'
import { useCurrentCampQuery, useUpdateCampMutation } from '@/api/queries/camps'
import { useParticipantsQuery } from '@/api/queries/participants'
import type { components } from '@/api/schema'
type CampRequest = components['schemas']['CampRequest']

const { data: camp } = useCurrentCampQuery()
const { data: participants } = useParticipantsQuery()
const { mutate: updateCamp } = useUpdateCampMutation()

const handleUpdate = (updatedCamp: CampRequest) => {
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
