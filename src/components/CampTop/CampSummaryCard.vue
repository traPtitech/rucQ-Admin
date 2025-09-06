<script setup lang="ts">
import { computed, ref } from 'vue'
import { parseISO, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import UsersCopyButton from '@/components/shared/UsersCopyButton.vue'
import CampNotifications from '@/components/CampTop/CampNotifications.vue'
import CampSummaryEditor from '@/components/CampTop/CampSummaryEditor.vue'
import type { components } from '@/api/schema'

const props = defineProps<{
  camp?: components['schemas']['CampResponse']
  participants?: components['schemas']['UserResponse'][]
}>()

const emit = defineEmits<{
  (e: 'update', camp: components['schemas']['CampRequest']): void
}>()

const dialog = ref(false)
const participantIds = computed(() => props.participants?.map((p) => p.id) ?? [])

const participantsFormatter = (users: string[]) => {
  return users.map((user) => `${user} `).join('') // 'user1 user2 ' の形式
}

const formatDate = (date: string) => {
  return format(parseISO(date), 'M/d(EEEEE)', { locale: ja })
}

const handleUpdate = (updatedCamp: components['schemas']['CampRequest']) => {
  dialog.value = false
  emit('update', updatedCamp)
}
</script>

<template>
  <div v-if="camp">
    <section-title title="概要" action-icon="mdi-pencil" @action="dialog = true" />
    <section-card>
      <div class="text-h4 font-weight-bold mb-3">{{ camp.name }}</div>
      <div class="d-flex flex-column ga-2 mb-3">
        <div>
          <div class="text-body-2">開催日</div>
          <div class="text-h5">
            {{ formatDate(camp.dateStart) }} - {{ formatDate(camp.dateEnd) }}
          </div>
        </div>
        <div>
          <div class="text-body-2">参加人数</div>
          <div class="d-flex align-end ga-2">
            <div class="text-h5">{{ participantIds.length }}</div>
            <users-copy-button :users="participantIds" :formatter="participantsFormatter" />
          </div>
        </div>
        <div>
          <div class="text-body-2">参加者</div>
          <div class="flex flex-wrap">
            <span v-for="participant in participants" :key="participant.id">
              <router-link
                :to="{
                  name: 'UserInformation',
                  params: { campname: camp.displayId },
                  query: { id: participant.id },
                }"
              >
                <user-avatar :user-id="participant.id" size="small" />
              </router-link>
            </span>
          </div>
        </div>
      </div>
      <camp-notifications :camp="camp" />
    </section-card>
  </div>
  <div v-else>
    <section-title title="概要" />
    <section-card>
      <p class="text-medium-emphasis">合宿の取得に失敗しました</p>
    </section-card>
  </div>
  <v-dialog v-if="camp" v-model="dialog" max-width="600">
    <CampSummaryEditor :camp="camp" @update="handleUpdate" />
  </v-dialog>
</template>
