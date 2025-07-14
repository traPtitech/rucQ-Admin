<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import SectionCard from '@/components/shared/SectionCard.vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import type { components } from '@/api/schema'
type Camp = components['schemas']['CampResponse']

const { title, camps } = defineProps<{
  title: string
  camps: Camp[]
}>()

const formatDate = (date: string) => {
  return format(parseISO(date), 'yyyy/MM/dd')
}
</script>

<template>
  <section-card>
    <h3>{{ title }}</h3>
    <content-card
      v-for="camp in camps"
      :key="camp.id"
      :to="{ name: 'CampTop', params: { campname: camp.displayId } }"
    >
      <h4 class="text-h6">{{ camp.name }}</h4>
      <p class="text-medium-emphasis">
        {{ formatDate(camp.dateStart) }} - {{ formatDate(camp.dateEnd) }}
      </p>
    </content-card>
  </section-card>
</template>
