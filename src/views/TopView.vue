<script setup lang="ts">
import CampListGroup from '@/components/TopView/CampListGroup.vue'
import StaffListGroup from '@/components/TopView/StaffListGroup.vue'
</script>

<template>
  <v-container>
    <h1>合宿Adminトップ</h1>
    <div>
      <v-row>
        <v-col cols="12" md="6">
          <CampListGroup />
        </v-col>
        <v-col cols="12" md="6">
          <StaffListGroup />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
