<script setup lang="ts">
import CampListGroup from '@/components/TopView/CampListGroup.vue'
import StaffListGroup from '@/components/TopView/StaffListGroup.vue'
</script>

<template>
  <v-container>
    <h1>合宿Adminトップ</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <CampListGroup />
        </v-col>
        <v-col cols="12" md="6">
          <StaffListGroup />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
