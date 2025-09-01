<script setup lang="ts">
import type { components } from '@/api/schema'
type Room = components['schemas']['RoomResponse']

defineProps<{
  room: Room
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()
</script>
