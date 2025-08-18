<script setup lang="ts">
import type { components } from '@/api/schema'
type User = components['schemas']['UserResponse']
type Payment = components['schemas']['PaymentResponse']

defineProps<{
  participants: User[]
  payments: Payment[]
}>()
</script>
