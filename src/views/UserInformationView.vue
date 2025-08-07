<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import UnselectedSection from '@/components/UserInformation/UnselectedSection.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import UserDetails from '@/components/UserInformation/UserDetails.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import type { VAutocomplete } from 'vuetify/components'

const route = useRoute()
const campname = route.params.campname as string
const idQuery = route.query.id as string | undefined
const display = useDisplay()
const isSmAndUp = display.smAndUp
const autoCompleteRef = ref<VAutocomplete | null>(null)

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

const postRegistration = async (userId: string) => {
  if (!camp.value) return
  const { error } = await apiClient.POST('/api/admin/camps/{campId}/participants', {
    params: { path: { campId: camp.value.id } },
    body: { userId },
  })
  if (!error) {
    participants.value.push({ id: userId, isStaff: false })
    selectedId.value = userId
  }
}

const deleteRegistration = async (campId: number, userId: string) => {
  if (!camp.value) return
  const { error } = await apiClient.DELETE('/api/admin/camps/{campId}/participants/{userId}', {
    params: { path: { campId, userId } },
  })
  if (!error) {
    participants.value = participants.value.filter((p) => p.id !== userId)
    if (selectedId.value === userId) {
      selectedId.value = undefined
    }
  }
}

// IDが変更されたときにフォーカスを外す
watch(selectedId, (newId, oldId) => {
  if (autoCompleteRef.value === null) return
  if (!newId || newId === oldId) return
  autoCompleteRef.value.blur()
})
</script>

<template>
  <v-container v-if="camp" max-width="800">
    <div class="d-flex align-center ga-4">
      <user-avatar :user-id="selectedId" :size="isSmAndUp ? 64 : 48" />
      <v-autocomplete
        ref="autoCompleteRef"
        v-model="selectedId"
        :items="participants"
        item-title="id"
        item-value="id"
        :class="isSmAndUp ? 'title-input-desktop' : 'title-input-mobile'"
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
    <user-details
      v-if="selectedId"
      class="mt-4"
      :camp-id="camp.id"
      :user-id="selectedId"
      @delete-registration="deleteRegistration"
    />
    <unselected-section v-else class="mt-4" @registration="postRegistration" />
  </v-container>
</template>

<style scoped>
.title-input-desktop :deep(.v-field__input) {
  font-size: 2rem;
  font-weight: 700;
}
.title-input-mobile :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
