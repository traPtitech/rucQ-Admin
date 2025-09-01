<script setup lang="ts">
import { ref } from 'vue'
import type { components } from '@/api/schema'
type RoomGroupRequest = components['schemas']['RoomGroupRequest']

const model = defineModel<boolean>()
const roomGroupName = ref('')

const emit = defineEmits<{
  (e: 'create', roomGroup: RoomGroupRequest): void
}>()

const create = () => {
  emit('create', { name: roomGroupName.value })
  model.value = false
  roomGroupName.value = ''
}

const cancel = () => {
  model.value = false
  roomGroupName.value = ''
}
</script>
