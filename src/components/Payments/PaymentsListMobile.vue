<script setup lang="ts">
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { statusColor, type PaymentData } from '@/components/Payments/payments-list'

defineProps<{
  data: PaymentData[]
}>()

const headers = [
  { title: 'ユーザー', key: 'userId' },
  { title: 'ステータス', key: 'statusValue' },
  { key: 'data-table-expand', width: 0 },
]
</script>

<template>
  <v-data-table
    class="data-table"
    :headers="headers"
    :items="data"
    item-value="userId"
    items-per-page="-1"
    :sort-by="[{ key: 'statusValue', order: 'asc' }]"
    density="compact"
    hide-default-footer
    show-expand
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
    <template #[`item.statusValue`]="{ item }">
      <v-chip :color="statusColor(item.status)" size="small">
        {{ item.status }}
      </v-chip>
    </template>
    <template #[`item.data-table-expand`]="{ internalItem, isExpanded, toggleExpand }">
      <v-btn
        :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="plain"
        size="small"
        density="compact"
        @click="toggleExpand(internalItem)"
      />
    </template>
    <template #[`expanded-row`]="{ columns, item }">
      <tr class="bg-grey-lighten-5">
        <td :colspan="columns.length" class="px-4 py-2">
          <div class="d-flex ga-4">
            <div class="w-50">
              <span class="text-caption">合宿費: </span>
              <span v-if="item.amount !== undefined" class="text-body-1">{{
                item.amount.toLocaleString()
              }}</span>
              <span v-else class="text-body-1 text-medium-emphasis">(未登録)</span>
            </div>
            <div class="w-50">
              <span class="text-caption">支払額: </span>
              <span class="text-body-1">{{ (item.amountPaid ?? 0).toLocaleString() }}</span>
            </div>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
