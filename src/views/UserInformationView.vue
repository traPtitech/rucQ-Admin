<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import UserDetails from '@/components/UserInformation/UserDetails.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const route = useRoute()
const campname = route.params.campname as string
const idQuery = route.query.id as string | undefined
const camp = ref<components['schemas']['CampResponse']>()
const participants = ref<components['schemas']['UserResponse'][]>([])
const selectedId = ref<string | undefined>(idQuery ?? undefined)

const fetchCamp = async () => {
  const { data } = await apiClient.GET('/api/camps')
  return data?.find((camp) => camp.displayId === campname)
}
const fetchParticipants = async () => {
  if (!camp.value) return []
  const { data } = await apiClient.GET('/api/camps/{campId}/participants', {
    params: { path: { campId: camp.value?.id } },
  })
  return data ?? []
}

onMounted(async () => {
  camp.value = await fetchCamp()
  participants.value = await fetchParticipants()
})
</script>

<template>
  <v-container v-if="camp" max-width="800">
    <div class="d-flex align-center ga-4">
      <user-avatar :user-id="selectedId" :size="64" />
      <v-autocomplete
        v-model="selectedId"
        :items="participants"
        item-title="id"
        item-value="id"
        class="title-input"
        label="traQ ID"
        variant="outlined"
        auto-select-first
        hide-details
      >
        <template #item="{ props, item }">
          <v-list-item v-bind="props" :title="item.raw.id">
            <template #prepend>
              <user-avatar :user-id="item.raw.id" />
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
    </div>
    <user-details v-if="selectedId" class="mt-4" :camp-id="camp.id" :user-id="selectedId" />
    <div v-else class="mt-10 text-center text-h5 text-medium-emphasis">ユーザー未選択</div>
  </v-container>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 2rem;
  font-weight: 700;
}
</style>
