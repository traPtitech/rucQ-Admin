<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import UserAvatarList from '@/components/shared/UserAvatarList.vue'
import UsersCopyButton from '@/components/shared/UsersCopyButton.vue'
import type { components } from '@/api/schema'
type RollCall = components['schemas']['RollCallResponse']
type RollCallReaction = components['schemas']['RollCallReactionResponse']

const props = defineProps<{
  rollCall: RollCall
  reactions: RollCallReaction[]
}>()

const reactedUserIds = computed<string[]>(() => {
  return props.reactions.map((r) => r.userId)
})

const unReactedUserIds = computed<string[]>(() => {
  const targetUserIds = props.rollCall.subjects
  return targetUserIds.filter((userId) => !reactedUserIds.value.includes(userId))
})
</script>

<template>
  <div>
    <section-title title="概要" />
    <section-card class="d-flex flex-column ga-2">
      <div>
        <div class="text-h5 font-weight-bold">{{ rollCall.name }}</div>
        <div class="text-body-1">{{ rollCall.description }}</div>
      </div>
      <div>
        <div class="text-body-2">対象</div>
        <user-avatar-list :users="rollCall.subjects" show-count />
      </div>
      <div class="d-flex ga-4">
        <div class="w-50">
          <div class="text-body-2">回答済み</div>
          <div class="d-flex align-end ga-2">
            <div class="text-h5">{{ reactedUserIds.length }}</div>
            <users-copy-button :users="reactedUserIds" />
          </div>
        </div>
        <div class="w-50">
          <div class="text-body-2">未回答</div>
          <div class="d-flex align-end ga-2">
            <div class="text-h5">{{ unReactedUserIds.length }}</div>
            <users-copy-button :users="unReactedUserIds" />
          </div>
        </div>
      </div>
    </section-card>
  </div>
</template>
