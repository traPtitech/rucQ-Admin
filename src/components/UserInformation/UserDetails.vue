<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import AnswerGroupCard from '@/components/UserInformation/AnswerGroupCard.vue'
import DeleteRegistrationButton from '@/components/UserInformation/DeleteRegistrationButton.vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

const props = defineProps<{
  campId: number
  userId: string
}>()

const emit = defineEmits<{
  // ユーザーの削除
  (e: 'deleteRegistration', campId: number, userId: string): void
}>()

const questionGroups = ref<components['schemas']['QuestionGroupResponse'][]>([])

const fetchQuestionGroups = async () => {
  const { data } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: props.campId } },
  })
  return data ?? []
}

onMounted(async () => {
  questionGroups.value = await fetchQuestionGroups()
})
</script>

<template>
  <div>
    <div v-for="questionGroup in questionGroups" :key="questionGroup.id">
      <section-title :title="questionGroup.name" />
      <answer-group-card :user-id="userId" :question-group="questionGroup" />
    </div>
    <div class="d-flex justify-center">
      <delete-registration-button
        :user-id="userId"
        @delete="emit('deleteRegistration', props.campId, userId)"
      />
    </div>
  </div>
</template>
