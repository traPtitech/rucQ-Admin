import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

type Camp = components['schemas']['Camp']

export const useCampStore = defineStore('camp', () => {
  const camp = ref<Camp | undefined>(undefined)

  const fetchCamp = async (campname: string) => {
    const { data, error } = await apiClient.GET('/api/camps')
    if (error) {
      camp.value = undefined
      return
    }
    const camps = data
    const foundCamp = camps.find((c: Camp) => c.displayId === campname)
    if (foundCamp) camp.value = foundCamp
    else camp.value = undefined
  }

  return {
    camp,
    fetchCamp,
  }
})
