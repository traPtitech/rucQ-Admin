<script setup lang="ts">
import type { components } from '@/api/schema'
type RoomGroup = components['schemas']['RoomGroupResponse']
type RoomGroupRequest = components['schemas']['RoomGroupRequest']
type RoomRequest = components['schemas']['RoomRequest']

defineProps<{
  roomGroup: RoomGroup
}>()

const emit = defineEmits<{
  (e: 'createRoom', room: RoomRequest): void
  (e: 'updateRoom', roomId: number, room: RoomRequest): void
  (e: 'deleteRoom', roomId: number): void
  (e: 'updateRoomGroup', roomGroupId: number, roomGroup: RoomGroupRequest): void
  (e: 'deleteRoomGroup', roomGroupId: number): void
}>()
</script>
