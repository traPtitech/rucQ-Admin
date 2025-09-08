<script setup lang="ts">
import { ref, computed } from 'vue'
import type { components } from '@/api/schema'
import type { VForm } from 'vuetify/components'
import ContentCard from '@/components/shared/ContentCard.vue'
import RollCallChooseQuestion from '@/components/RollCallList/RollCallChooseQuestion.vue'
type RollCallRequest = components['schemas']['RollCallRequest']
type User = components['schemas']['UserResponse']
type QuestionGroup = components['schemas']['QuestionGroupResponse']
const emit = defineEmits<{
  (e: 'create', rollcall: RollCallRequest): void
  (e: 'cancel'): void
}>()

const { participants } = defineProps<{
  participants: User[]
  questionGroups: QuestionGroup[]
}>()

const formRef = ref<VForm | null>(null)
const rollcallType = ref<'all' | 'specific' | 'question'>('all')

const name = ref<string>('')
const description = ref<string>('')
const options = ref<string[]>([''])
const subjectsString = ref<string>('')
const subjects = computed(() =>
  subjectsString.value
    .split(/,|\s+/)
    .map((s) => s.trim().replace(/^@/, ''))
    .filter((s) => !!s),
)

const required = (v: string | undefined) => !!v || '必須項目です'
const isValidOptions = (index: number) => (v: string | undefined) => {
  if (index !== 0 && index === options.value.length - 1) {
    return true
  }
  return required(v)
}

const handleCreate = () => {
  if (!formRef.value?.isValid) return
  if (options.value.at(-1) === '') {
    options.value.pop()
  }
  if (rollcallType.value === 'all') {
    subjectsString.value = participants.map((u) => u.id).join(' ')
  }
  const rollcall: RollCallRequest = {
    name: name.value,
    description: description.value,
    options: options.value,
    subjects: subjects.value,
  }
  emit('create', rollcall)
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="handleCreate">
    <v-card title="点呼の作成">
      <div class="d-flex flex-column ga-1 px-4">
        <v-text-field label="点呼名" v-model="name" :rules="[required]" />
        <v-text-field label="説明" v-model="description" :rules="[required]" />
        <content-card title="選択肢" class="ga-1">
          <v-text-field
            v-for="(_, index) in options"
            :key="index"
            v-model="options[index]"
            :rules="[isValidOptions(index)]"
          >
            <template #append>
              <v-btn
                icon="mdi-close"
                @click="options.splice(index, 1)"
                v-if="index !== options.length - 1"
                variant="plain"
              />
              <v-btn icon="mdi-plus" @click="options.push('')" v-else variant="plain" />
            </template>
          </v-text-field>
        </content-card>
        <content-card title="対象者">
          <v-btn-toggle v-model="rollcallType" mandatory>
            <v-btn value="all">全員</v-btn>
            <v-btn value="specific">個別に選択</v-btn>
            <v-btn value="question">回答結果から選択</v-btn>
          </v-btn-toggle>
          <div v-if="rollcallType === 'specific'">
            <v-text-field
              label="対象者 (ユーザーIDをスペースかカンマで区切って入力)"
              v-model="subjectsString"
            />
          </div>
          <roll-call-choose-question
            v-if="rollcallType === 'question'"
            v-model="subjectsString"
            :questionGroups="questionGroups"
          />
        </content-card>
      </div>
      <v-card-actions>
        <v-btn @click="emit('cancel')">キャンセル</v-btn>
        <v-btn type="submit" color="primary">作成</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
