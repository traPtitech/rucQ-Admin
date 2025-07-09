<script setup lang="ts">
import { apiClient } from '@/api/apiClient'
import { compareAsc } from 'date-fns'
import { ref, onMounted, computed, watch } from 'vue'
import type { components } from '@/api/schema'
import CampList from '@/components/TopView/CampList.vue'
import AddCampDialogButton from '@/components/TopView/AddCampDialogButton.vue'

type Camp = components['schemas']['CampResponse']
const fetchCamps = async () => {
  const { data, error } = await apiClient.GET('/api/camps')
  if (error) {
    return []
  }
  return data
}
const camps = ref<Camp[]>([])
onMounted(async () => {
  camps.value = await fetchCamps()
})
const pastCamps = computed(() => {
  return camps.value.filter((camp) => compareAsc(new Date(camp.dateEnd), new Date()) < 0)
})
const plannedCamps = computed(() => {
  return camps.value.filter((camp) => compareAsc(new Date(camp.dateEnd), new Date()) >= 0)
})

const addCampDialog = ref(false)

watch(addCampDialog, async (val) => {
  if (!val) {
    camps.value = await fetchCamps()
  }
})
</script>
<template>
  <div>
    <div class="d-flex align-center justify-space-between my-4">
      <h2>合宿一覧</h2>
      <AddCampDialogButton
        @submit="
          async () => {
            camps = await fetchCamps()
          }
        "
      />
    </div>
    <CampList title="予定された合宿" :camps="plannedCamps" />
    <CampList title="以前の合宿" :camps="pastCamps" />
  </div>
</template>
