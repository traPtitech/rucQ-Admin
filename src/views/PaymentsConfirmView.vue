<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import UserSelector from '@/components/PaymentsConfirm/UserSelector.vue'
import PaymentStatus from '@/components/PaymentsConfirm/PaymentStatus.vue'
import PaymentRegisterForm from '@/components/PaymentsConfirm/PaymentRegisterForm.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { usePaymentsQuery, useUpdatePaymentMutation } from '@/api/queries/payments'
import { useParticipantsQuery } from '@/api/queries/participants'
import { useCreateMessageMutation } from '@/api/queries/users'
import { getMessageContent, getMessageSendTime } from '@/components/PaymentsConfirm/messages'
import type { components } from '@/api/schema'
import type { VAutocomplete, VBtn } from 'vuetify/components'
type PaymentRequest = components['schemas']['PaymentRequest']

const { data: payments } = usePaymentsQuery()
const { data: participants } = useParticipantsQuery()
const { mutate: updatePayment } = useUpdatePaymentMutation()
const { mutate: createMessage } = useCreateMessageMutation()

const autocompleteRef = ref<VAutocomplete | null>(null)
const confirmButtonRef = ref<VBtn | null>(null)

const targetUsers = computed(() => {
  return [
    ...new Set([
      ...(participants.value?.map((user) => user.id) ?? []),
      ...(payments.value?.map((payment) => payment.userId) ?? []),
    ]),
  ]
})
const selectedId = ref<string | undefined>(undefined)
const newAmountPaid = ref<number | null>(null)
const selectedData = computed(() => payments.value?.find((p) => p.userId === selectedId.value))

const sendDm = () => {
  if (!selectedData.value) return
  if (newAmountPaid.value == null || newAmountPaid.value === 0) return
  const newMessage = {
    content: getMessageContent(
      selectedData.value.amount,
      selectedData.value.amountPaid,
      newAmountPaid.value,
    ),
    sendAt: getMessageSendTime(),
  }
  createMessage({ userId: selectedData.value.userId, newMessage })
}

const handleUpdate = (paymentId: number, updatedPayment: PaymentRequest) => {
  updatePayment(
    { paymentId, updatedPayment },
    {
      onSuccess: () => {
        sendDm()
        newAmountPaid.value = null
        selectedId.value = undefined
        autocompleteRef.value?.focus()
      },
    },
  )
}

const focusConfirmButton = async () => {
  if (selectedData.value?.amountPaid === 0) {
    newAmountPaid.value = selectedData.value.amount
    await nextTick()
    confirmButtonRef.value?.$el.focus()
  }
}
</script>

<template>
  <v-container v-if="participants !== undefined" max-width="800">
    <user-selector
      v-model:autocomplete-ref="autocompleteRef"
      v-model:selected-id="selectedId"
      :users="targetUsers"
      @tab-pressed="focusConfirmButton"
    />
    <section-card class="mt-4">
      <payment-status :user="selectedId" :data="selectedData" />
      <payment-register-form
        v-model:confirm-button-ref="confirmButtonRef"
        v-model:new-amount-paid="newAmountPaid"
        :data="selectedData"
        @update="handleUpdate"
      />
    </section-card>
  </v-container>
</template>
