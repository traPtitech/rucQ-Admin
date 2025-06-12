<script setup lang="ts">
import NavigationBar from '@/components/layout/NavigationBar.vue'
import TopNavBar from '@/components/layout/TopNavBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <TopNavBar />
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
