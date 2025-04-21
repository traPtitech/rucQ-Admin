import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Top',
      component: () => import('@/views/TopView.vue'),
    },
    {
      path: '/:campname',
      children: [
        {
          path: '',
          name: 'CampTop',
          component: () => import('@/views/CampTopView.vue'),
        },
        {
          path: 'guidebook',
          name: 'GuidebookEdit',
          component: () => import('@/views/GuidebookEditView.vue'),
        },
        {
          path: 'questions',
          name: 'QuestionsEdit',
          component: () => import('@/views/QuestionsEditView.vue'),
        },
        {
          path: 'questions/result',
          name: 'QuestionsResult',
          component: () => import('@/views/QuestionsResultView.vue'),
        },
        {
          path: 'users/:userid',
          name: 'UserInformation',
          component: () => import('@/views/UserInformationView.vue'),
        },
        {
          path: 'rooms',
          name: 'Rooms',
          component: () => import('@/views/RoomsView.vue'),
        },
        {
          path: 'rollcall',
          name: 'RollCallList',
          component: () => import('@/views/RollCallListView.vue'),
        },
        {
          path: 'rollcall/:rollcallid',
          name: 'RollCall',
          component: () => import('@/views/RollCallView.vue'),
        },
        {
          path: 'payments',
          name: 'Payments',
          component: () => import('@/views/PaymentsView.vue'),
        },
        {
          path: 'payments/register',
          name: 'PaymentsRegister',
          component: () => import('@/views/PaymentsRegisterView.vue'),
        },
      ],
    },
  ],
})

export default router
