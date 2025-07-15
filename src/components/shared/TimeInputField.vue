<script setup lang="ts">
import { ref, watch } from 'vue'

const time = defineModel<string>()

defineProps<{
  label?: string
}>()

const isModalOpen = ref(false)
const timeValue = ref(time.value)

watch(isModalOpen, (newValue) => {
  if (newValue) {
    timeValue.value = time.value
  } else {
    // time はモーダルが閉じられたときに更新される
    time.value = timeValue.value
  }
})
</script>

<template>
  <v-text-field v-model="time" :active="isModalOpen" :focused="isModalOpen" :label="label" readonly>
    <v-dialog v-model="isModalOpen" activator="parent" width="auto">
      <v-time-picker v-if="isModalOpen" v-model="timeValue" format="24hr" color="primary" />
    </v-dialog>
  </v-text-field>
</template>
