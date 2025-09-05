<script setup lang="ts">
import PaymentsSummary from '@/components/Payments/PaymentsSummary.vue'
import PaymentsInformation from '@/components/Payments/PaymentsInformation.vue'
import { usePaymentsQuery } from '@/api/queries/payments'
import { useParticipantsQuery } from '@/api/queries/participants'

const { data: payments } = usePaymentsQuery()
const { data: participants } = useParticipantsQuery()
</script>

<template>
  <v-container v-if="payments !== undefined && participants !== undefined" max-width="800">
    <payments-summary :participants="participants" :payments="payments" />
    <payments-information :participants="participants" :payments="payments" />
  </v-container>
</template>
