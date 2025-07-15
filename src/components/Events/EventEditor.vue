<script setup lang="ts">
import { ref, watch } from 'vue'
import { format, isAfter, isEqual, parse, parseISO } from 'date-fns'
import EventEditorActions from '@/components/Events/EventEditorActions.vue'
import TimeInputField from '@/components/shared/TimeInputField.vue'
import { combineDateAndTime, isValidTime } from '@/utils/date-time-utils'
import type { components } from '@/api/schema'
import type { VForm } from 'vuetify/components'

interface EditedEvent {
  name: string
  timeStart?: string
  timeEnd?: string
  location: string
  description: string
}

const props = defineProps<{
  date: string
  event?: components['schemas']['EventResponse']
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'update', id: number | undefined, event: components['schemas']['EventRequest']): void
  (e: 'delete', eventId: number): void
}>()

const formatDate = (date: string | undefined) => {
  if (!date) return undefined
  const parsedTime = parseISO(date)
  return format(parsedTime, 'HH:mm')
}

// momentイベントは開始時刻と終了時刻が同じイベントとして扱う
const editingEvent = ref<EditedEvent>({
  name: props.event?.name ?? '',
  timeStart: formatDate(props.event?.type === 'moment' ? props.event.time : props.event?.timeStart),
  timeEnd: formatDate(props.event?.type === 'moment' ? props.event.time : props.event?.timeEnd),
  location: props.event?.location ?? '',
  description: props.event?.description ?? '',
})
const formRef = ref<VForm | null>(null)

// バリデーション
const required = (v: unknown) => !!v || '必須項目です'
const time = (v: string | undefined) => {
  if (!v) return true
  return isValidTime(v) || '無効な時間です'
}
const endAfterStart = (timeStart: string | undefined) => (v: string | undefined) => {
  if (!v || !timeStart) return true
  const referenceDate = new Date()
  const start = parse(timeStart, 'HH:mm', referenceDate)
  const end = parse(v, 'HH:mm', referenceDate)
  return isAfter(end, start) || isEqual(end, start) || '終了は開始より前に設定できません'
}

// 終了時刻を自動入力
watch(
  () => editingEvent.value.timeStart,
  (newValue) => {
    if (newValue && (!editingEvent.value.timeEnd || newValue > editingEvent.value.timeEnd)) {
      editingEvent.value.timeEnd = newValue
    }
  },
)

const handleDelete = () => {
  if (props.event?.id) {
    emit('delete', props.event.id)
  }
}
const handleUpdate = (event: EditedEvent) => {
  if (!formRef.value?.isValid) return
  if (!event.timeStart || !event.timeEnd) return

  // ユーザー作成イベントの更新
  if (props.event?.type === 'duration') {
    emit('update', props.event.id, {
      type: 'duration',
      name: event.name,
      description: event.description,
      location: event.location,
      timeStart: combineDateAndTime(props.date, event.timeStart),
      timeEnd: combineDateAndTime(props.date, event.timeEnd),
      organizerId: props.event.organizerId,
      displayColor: props.event.displayColor,
    })
    return
  }

  // 合宿係イベントの作成,更新
  if (event.timeStart === event.timeEnd) {
    emit('update', props.event?.id, {
      type: 'moment',
      name: event.name,
      description: event.description,
      location: event.location,
      time: combineDateAndTime(props.date, event.timeStart),
    })
  } else {
    emit('update', props.event?.id, {
      type: 'official',
      name: event.name,
      description: event.description,
      location: event.location,
      timeStart: combineDateAndTime(props.date, event.timeStart),
      timeEnd: combineDateAndTime(props.date, event.timeEnd),
    })
  }
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="handleUpdate(editingEvent)">
    <v-card class="px-6 py-4">
      <div class="d-flex flex-column ga-1 pt-4">
        <v-text-field
          v-model="editingEvent.name"
          class="title-input"
          label="イベント名*"
          variant="underlined"
          density="compact"
          :rules="[required]"
          required
        />
        <v-row class="my-0">
          <v-col cols="12" sm="6" class="py-0 mb-1">
            <time-input-field
              v-model="editingEvent.timeStart"
              label="開始時刻*"
              :rules="[required, time]"
            />
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <time-input-field
              v-model="editingEvent.timeEnd"
              label="終了時刻*"
              :rules="[required, time, endAfterStart(editingEvent.timeStart)]"
            />
          </v-col>
        </v-row>
        <v-text-field v-model="editingEvent.location" label="開催場所" />
        <v-textarea
          v-model="editingEvent.description"
          label="説明"
          placeholder="# Markdownも書けます"
          rows="1"
          auto-grow
        />
      </div>
      <event-editor-actions
        :is-new-event="!props.event"
        @cancel="emit('cancel')"
        @delete="handleDelete"
        @save="handleUpdate(editingEvent)"
      />
    </v-card>
  </v-form>
</template>

<style scoped>
.title-input :deep(.v-field__input) {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
