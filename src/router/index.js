import { createRouter, createWebHistory } from 'vue-router';
import AIShortformUpload from '@/views/AIShortformUpload.vue';
import AIShortformStatus from '@/views/AIShortformStatus.vue';
import DefaultPage from '@/views/DefaultPage.vue';

const routes = [
  {
    path: '/ai-shortform',
    name: 'AIShortformUpload',
    component: AIShortformUpload,
  },
  {
    path: '/ai-shortform-status',
    name: 'AIShortformStatus',
    component: AIShortformStatus,
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

// router.beforeEach((to, from, next) => {
//   if (from.name === 'AIShortformUpload') {
//     console.log('Leaving AIShortformUpload globally');
//     const uploadComponent = from.matched.find(
//       (route) => route.name === 'AIShortformUpload'
//     )?.instances?.default;

//     if (uploadComponent) {
//       Object.keys(uploadComponent.cancelTokens).forEach((index) => {
//         uploadComponent.cancelTokens[index].cancel = true;
//         uploadComponent.uploadBoxes[index].status = '취소됨';
//       });
//     }
//   }
//   next();
// });


export default router;