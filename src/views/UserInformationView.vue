<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import UnselectedSection from '@/components/UserInformation/UnselectedSection.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import UserDetails from '@/components/UserInformation/UserDetails.vue'
import { useCurrentCampQuery } from '@/api/queries/camps'
import {
  useParticipantsQuery,
  useCreateParticipantMutation,
  useDeleteParticipantMutation,
} from '@/api/queries/participants'
import type { VAutocomplete } from 'vuetify/components'

const { data: camp } = useCurrentCampQuery()
const { data: participants } = useParticipantsQuery()
const { mutate: createParticipant } = useCreateParticipantMutation()
const { mutate: deleteParticipant } = useDeleteParticipantMutation()

const route = useRoute()
const idQuery = route.query.id as string | undefined
const display = useDisplay()
const isSmAndUp = display.smAndUp
const autoCompleteRef = ref<VAutocomplete | null>(null)

const selectedId = ref<string | undefined>(idQuery ?? undefined)

const handleRegistration = (userId: string) => {
  if (!camp.value) return
  createParticipant({ campId: camp.value.id, userId })
}

const handleDeleteRegistration = (userId: string) => {
  if (!camp.value) return
  deleteParticipant({ campId: camp.value.id, userId })
}

// IDが変更されたときにフォーカスを外す
watch(selectedId, (newId, oldId) => {
  if (autoCompleteRef.value === null) return
  if (!newId || newId === oldId) return
  autoCompleteRef.value.blur()
})
</script>

<template>
  <v-container max-width="800">
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
      :user-id="selectedId"
      @delete-registration="handleDeleteRegistration"
    />
    <unselected-section v-else class="mt-4" @registration="handleRegistration" />
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
