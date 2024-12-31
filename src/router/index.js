import { createRouter, createWebHistory } from 'vue-router';
import AIShortform from '@/views/AIShortform.vue';
import DefaultPage from '@/views/DefaultPage.vue';

const routes = [
  {
    path: '/ai-shortform',
    name: 'AIShortform',
    component: AIShortform,
  },
  {
    path: '/default',
    name: 'default',
    component: DefaultPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
