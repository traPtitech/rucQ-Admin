import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Top',
      component: () => import('@/views/TopView.vue'),
      meta: { title: 'トップ' },
    },
    {
      path: '/:campname',
      component: () => import('@/layouts/CampPageLayout.vue'),
      children: [
        {
          path: '',
          name: 'CampTop',
          component: () => import('@/views/CampTopView.vue'),
          meta: { title: '合宿トップ' },
        },
        {
          path: 'tools',
          name: 'Tools',
          component: () => import('@/views/ToolsView.vue'),
          meta: { title: 'ツール' },
        },
        {
          path: 'guidebook',
          name: 'GuidebookEdit',
          component: () => import('@/views/GuidebookEditView.vue'),
          meta: { title: '合宿のしおり' },
        },
        {
          path: 'questions',
          name: 'QuestionsEdit',
          component: () => import('@/views/QuestionsEditView.vue'),
          meta: { title: '質問編集' },
        },
        {
          path: 'questions/result',
          name: 'QuestionsResult',
          component: () => import('@/views/QuestionsResultView.vue'),
          meta: { title: '質問結果' },
        },
        {
          path: 'users',
          name: 'UserInformation',
          component: () => import('@/views/UserInformationView.vue'),
          meta: { title: 'ユーザー情報' },
        },
        {
          path: 'rooms',
          name: 'Rooms',
          component: () => import('@/views/RoomsView.vue'),
          meta: { title: '部屋情報' },
        },
        {
          path: 'rollcall',
          name: 'RollCallList',
          component: () => import('@/views/RollCallListView.vue'),
          meta: { title: '点呼' },
        },
        {
          path: 'rollcall/:rollcallid',
          name: 'RollCall',
          component: () => import('@/views/RollCallView.vue'),
          meta: { title: '点呼詳細' },
        },
        {
          path: 'payments',
          name: 'Payments',
          component: () => import('@/views/PaymentsView.vue'),
          meta: { title: '支払い情報' },
        },
        {
          path: 'payments/register',
          name: 'PaymentsRegister',
          component: () => import('@/views/PaymentsRegisterView.vue'),
          meta: { title: '支払い登録' },
        },
        {
          path: 'payments/confirm',
          name: 'PaymentsConfirm',
          component: () => import('@/views/PaymentsConfirmView.vue'),
          meta: { title: '支払い確認' },
        },
        {
          path: 'events',
          name: 'Events',
          component: () => import('@/views/EventsView.vue'),
          meta: { title: 'イベント' },
        },
      ],
    },
  ],
})

export default router
