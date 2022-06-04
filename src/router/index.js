import { createRouter, createWebHistory } from 'vue-router';
// layouts
import LandingLayout from '../layouts/LandingLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
// pages
import NotFound from '../views/NotFound.vue';
import Locked from '../views/Locked.vue';
import Maintenance from '../views/Maintenance.vue';
import LandingIndex from '../views/landing/LandingIndex.vue';
import LandingLogin from '../views/landing/LandingLogin.vue';

// admin
import DashBoard from '../views/admin/DashBoard.vue'
import AdminSiswa from '../views/admin/siswa/Index.vue'

// testing
// import TestingCetak1 from '../views/testing/TestingCetak1.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingLayout,
    redirect: '/',
    children: [
      {
        path: '/', 
        name: 'LandingIndex',
        component: LandingIndex,
      },
      {
        path: '/login', 
        name: 'LandingLogin',
        component: LandingLogin,
      },
      {
        path: '/404',
        name: 'NotFound',
        component: NotFound,
      },
      {
        path: '/locked',
        name: 'Locked',
        component: Locked,
      },
      {
        path: '/maintenance',
        name: 'Maintenance',
        component: Maintenance,
      },
    ],
  },
  {
    path: '/:catchAll(.*)', redirect: '/404',
  },
  {
    path: '/pages/',
    name: 'LandingAdmin',
    component: AdminLayout,
    redirect: '/pages/admin',
    children: [
      {
        path: '/pages/admin', 
        name: 'AdminDashboard',
        component: DashBoard,
      },
      {
        path: '/pages/siswa', 
        name: 'AdminSiswa',
        component: AdminSiswa,
      },
    ]
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
