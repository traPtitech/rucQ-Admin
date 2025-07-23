<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ContentCard from '@/components/shared/ContentCard.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import {
  groupFreeTextAnswers,
  groupFreeNumberAnswers,
  groupSingleChoiceAnswers,
  groupMultipleChoiceAnswers,
  type GroupedAnswer,
} from '@/components/QuestionsResult/group-answers'
import type { components } from '@/api/schema'
type Question = components['schemas']['QuestionResponse']
type Answer = components['schemas']['AnswerResponse']

const props = defineProps<{
  question: Question
  answers: Answer[]
}>()

const route = useRoute()
const campname = route.params.campname as string

const groupedAnswers = computed<GroupedAnswer[]>(() => {
  switch (props.question.type) {
    case 'free_text':
      return groupFreeTextAnswers(props.question, props.answers)
    case 'free_number':
      return groupFreeNumberAnswers(props.question, props.answers)
    case 'single':
      return groupSingleChoiceAnswers(props.question, props.answers)
    case 'multiple':
      return groupMultipleChoiceAnswers(props.question, props.answers)
    default:
      const _exhaustiveCheck: never = props.question
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as Question).type}`)
  }
})

const groupKey = (group: GroupedAnswer) => {
  switch (group.type) {
    case 'free_text':
    case 'free_number':
      return group.answerContent
    case 'single':
    case 'multiple':
      return group.answerContent.id
    default:
      const _exhaustiveCheck: never = group
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as GroupedAnswer).type}`)
  }
}
const answerContent = (group: GroupedAnswer) => {
  switch (group.type) {
    case 'free_text':
    case 'free_number':
      return group.answerContent
    case 'single':
    case 'multiple':
      return group.answerContent.content
    default:
      const _exhaustiveCheck: never = group
      throw new Error(`Unexpected type: ${(_exhaustiveCheck as GroupedAnswer).type}`)
  }
}
</script>

<template>
  <content-card>
    <h3>{{ props.question.title }}</h3>
    <v-table>
      <tbody>
        <tr v-for="group in groupedAnswers" :key="groupKey(group)">
          <td v-if="answerContent(group)" class="text-subtitle-1">{{ answerContent(group) }}</td>
          <td v-else class="text-subtitle-2 text-medium-emphasis">(回答なし)</td>
          <td class="text-body-1 text-right" width="60px">{{ group.users.length }}</td>
          <td width="40%" class="pr-0">
            <div class="flex flex-wrap">
              <span v-for="userId in group.users" :key="userId">
                <router-link
                  :to="{
                    name: 'UserInformation',
                    params: { campname: campname },
                    query: { id: userId },
                  }"
                >
                  <user-avatar :user-id="userId" size="x-small" />
                </router-link>
              </span>
            </div>
          </td>
          <td class="w-0">
            <v-btn icon="mdi-content-copy" size="small" density="comfortable" variant="plain" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </content-card>
</template>
