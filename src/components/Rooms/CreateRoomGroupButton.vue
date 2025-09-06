<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="d-flex justify-center">
    <v-btn
      color="primary"
      class="flex-grow-1"
      prepend-icon="mdi-plus"
      max-width="400"
      @click="emit('click')"
    >
      部屋グループを作成
    </v-btn>
  </div>
</template>
