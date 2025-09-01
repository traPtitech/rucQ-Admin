<script setup lang="ts">
import { ref } from 'vue'
import ContentCard from '@/components/shared/ContentCard.vue'
import type { components } from '@/api/schema'
type Room = components['schemas']['RoomResponse']
type RoomRequest = components['schemas']['RoomRequest']
type User = components['schemas']['UserResponse']

const props = defineProps<{
  roomGroupId: number
  room: Room
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'save', roomId: number, room: RoomRequest): void
}>()

const name = ref<string>(props.room.name)
const memberIds = ref<string>(props.room.members.map((user) => `@${user.id}`).join(' '))

const handleSave = () => {
  const room: RoomRequest = {
    name: name.value,
    roomGroupId: props.roomGroupId,
    memberIds: memberIds.value
      .split(' ')
      .map((id) => id.replace(/^@/, ''))
      .filter((id) => id !== ''),
  }
  emit('save', props.room.id, room)
}
</script>
