<script setup lang="ts">
import { computed } from 'vue'
import { isAfter, parseISO } from 'date-fns'
import type { components } from '@/api/schema'

interface Notification {
  condition: boolean
  message: string
  type: 'info' | 'warning' | 'error'
}

const { camp } = defineProps<{
  camp: components['schemas']['CampResponse']
}>()

// 通知する条件と内容を定義
const notifications = computed<Notification[]>(() => [
  {
    condition: camp.isDraft,
    message: 'この合宿は現在下書きに設定されています',
    type: 'info',
  },
  {
    condition: camp.isRegistrationOpen,
    message: 'この合宿は現在参加登録を受け付けています',
    type: 'info',
  },
  {
    condition: camp.isPaymentOpen,
    message: 'この合宿は現在参加費の振込期間中です',
    type: 'info',
  },
  {
    condition: camp.isDraft && camp.isRegistrationOpen,
    message: '下書き設定と参加登録の設定が同時に有効になっています',
    type: 'warning',
  },
  {
    condition: camp.isDraft && camp.isPaymentOpen,
    message: '下書き設定と合宿費の振込期間中の設定が同時に有効になっています',
    type: 'warning',
  },
  {
    condition: camp.isPaymentOpen && camp.isRegistrationOpen,
    message: '参加登録の設定と合宿費の振込期間中の設定が同時に有効になっています',
    type: 'warning',
  },
  {
    condition: camp.isRegistrationOpen && isAfter(new Date(), parseISO(camp.dateStart)),
    message: 'この合宿は開始日を過ぎていますが、参加登録が有効になっています',
    type: 'error',
  },
])

const filteredNotifications = computed(() => {
  return notifications.value.filter((notification) => notification.condition)
})
</script>

<template>
  <div>
    <div v-for="(notification, index) in filteredNotifications" :key="index">
      <div
        v-if="notification.type === 'info'"
        :class="[$style.notification, $style['notification-info']]"
      >
        <v-icon icon="mdi-information-outline" size="small" />
        <span>{{ notification.message }}</span>
      </div>
      <div
        v-if="notification.type === 'warning'"
        :class="[$style.notification, $style['notification-warning']]"
      >
        <v-icon icon="mdi-alert-outline" size="small" />
        <p>{{ notification.message }}</p>
      </div>
      <div
        v-if="notification.type === 'error'"
        :class="[$style.notification, $style['notification-error']]"
      >
        <v-icon icon="mdi-close-circle-outline" size="small" />
        <p>{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<style module>
.notification {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: 4px;
  padding: 12px 16px;
  margin: 4px 0;
  font-size: 1rem;
  font-weight: 500;
}

.notification-info {
  color: rgb(var(--v-theme-info));
  background-color: rgba(var(--v-theme-info), 0.1);
}

.notification-warning {
  color: rgb(var(--v-theme-warning));
  background-color: rgba(var(--v-theme-warning), 0.1);
}

.notification-error {
  color: rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>
