<script setup lang="ts">
import BottomNavBar from '@/components/layout/BottomNavBar.vue'
import SideNavBar from '@/components/layout/SideNavBar.vue'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import type { RouteLocationNamedRaw } from 'vue-router'

export interface NavItem {
  title: string
  value: string
  icon: string
  to: RouteLocationNamedRaw
}

const { mobile } = useDisplay()
const route = useRoute()
const campname = computed(() => route.params.campname as string | undefined)
const navs = computed<NavItem[]>(() => [
  {
    title: '合宿トップ',
    value: 'camp_top',
    icon: 'mdi-home',
    to: { name: 'CampTop', params: { campname: campname.value } },
  },
  {
    title: '回答結果',
    value: 'questions_result',
    icon: 'mdi-account-group',
    to: { name: 'QuestionsResult', params: { campname: campname.value } },
  },
  {
    title: 'ユーザー情報',
    value: 'user_information',
    icon: 'mdi-account',
    to: { name: 'UserInformation', params: { campname: campname.value } },
  },
  {
    title: 'ツール',
    value: 'tools',
    icon: 'mdi-toolbox',
    to: { name: 'Tools', params: { campname: campname.value } },
  },
])
</script>

<template>
  <nav v-if="campname != undefined">
    <BottomNavBar v-if="mobile" :navs="navs" />
    <SideNavBar v-else :navs="navs" />
  </nav>
</template>
