<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const data = ref<components['schemas']['Camp'][]>([])

onMounted(async () => {
  data.value = (await apiClient.GET('/api/camps')).data ?? []
})
</script>

<template>
  <v-container>
    {{ data.length }}
    <ul>
      <li v-for="camp in data" :key="camp.id">
        {{ camp.name }}
      </li>
    </ul>
  </v-container>
</template>
