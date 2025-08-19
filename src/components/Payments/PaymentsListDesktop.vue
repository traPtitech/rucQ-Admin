<script setup lang="ts">
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { statusColor, type PaymentData } from '@/components/Payments/payments-list'

defineProps<{
  data: PaymentData[]
}>()

const headers = [
  { title: 'ユーザー', key: 'userId' },
  { title: '合宿費', key: 'amount', align: 'end' as const },
  { title: '支払額', key: 'amountPaid', align: 'end' as const },
  { title: 'ステータス', key: 'statusValue' },
]
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="data"
    items-per-page="-1"
    :sort-by="[{ key: 'statusValue', order: 'asc' }]"
    density="compact"
    hide-default-footer
  >
    <template #[`item.userId`]="{ item }">
      <div class="d-flex align-center ga-2">
        <user-avatar :userId="item.userId" size="x-small" />
        <div>
          <span>{{ item.userId }}</span>
          <span v-if="!item.isParticipant" class="text-caption text-medium-emphasis">
            (キャンセル)
          </span>
        </div>
      </div>
    </template>
    <template #[`item.amount`]="{ item }">
      <span v-if="item.amount !== undefined">{{ item.amount.toLocaleString() }}</span>
      <span v-else class="text-medium-emphasis">(未登録)</span>
    </template>
    <template #[`item.amountPaid`]="{ item }">
      <span>{{ (item.amountPaid ?? 0).toLocaleString() }}</span>
    </template>
    <template #[`item.statusValue`]="{ item }">
      <v-chip :color="statusColor(item.status)" size="small">
        {{ item.status }}
      </v-chip>
    </template>
  </v-data-table>
</template>
