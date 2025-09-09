<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import OptionItem from '@/components/RollCall/OptionItem.vue'
import type { components } from '@/api/schema'
type RollCall = components['schemas']['RollCallResponse']
type RollCallReaction = components['schemas']['RollCallReactionResponse']
interface GroupedReactions {
  content: string
  userIds: string[]
}

const props = defineProps<{
  rollCall: RollCall
  reactions: RollCallReaction[]
}>()

const groupedReactions = computed<GroupedReactions[]>(() => {
  return props.rollCall.options.map((option) => ({
    content: option,
    userIds: props.reactions
      .filter((reactions) => reactions.content === option)
      .map((r) => r.userId),
  }))
})

const unReactedUserIds = computed<string[]>(() => {
  const targetUserIds = props.rollCall.subjects
  const reactedUserIds = props.reactions.map((r) => r.userId)
  return targetUserIds.filter((userId) => !reactedUserIds.includes(userId))
})
</script>

<template>
  <div>
    <section-title title="リアクション" />
    <section-card>
      <option-item
        v-for="item in groupedReactions"
        :key="item.content"
        :content="item.content"
        :user-ids="item.userIds"
      />
      <option-item :user-ids="unReactedUserIds" />
    </section-card>
  </div>
</template>
