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
import AdminSiswaEdit from '../views/admin/siswa/Edit.vue'
import AdminKelas from '../views/admin/kelas/Index.vue'
import AdminKelasEdit from '../views/admin/kelas/Edit.vue'
import AdminWaliKelas from '../views/admin/walikelas/Index.vue'
import AdminWaliKelasEdit from '../views/admin/walikelas/Edit.vue'
import AdminPengguna from '../views/admin/pengguna/Index.vue'
import AdminPenggunaEdit from '../views/admin/pengguna/Edit.vue'

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
      {
        path: '/pages/siswa/:id', 
        name: 'AdminSiswaEdit',
        component: AdminSiswaEdit,
      },
      {
        path: '/pages/kelas', 
        name: 'AdminKelas',
        component: AdminKelas,
      },
      {
        path: '/pages/kelas/:id', 
        name: 'AdminKelasEdit',
        component: AdminKelasEdit,
      },
      {
        path: '/pages/walikelas', 
        name: 'AdminWaliKelas',
        component: AdminWaliKelas,
      },
      {
        path: '/pages/walikelas/:id', 
        name: 'AdminWaliKelasEdit',
        component: AdminWaliKelasEdit,
      },
      {
        path: '/pages/pengguna', 
        name: 'AdminPengguna',
        component: AdminPengguna,
      },
      {
        path: '/pages/pengguna/:id', 
        name: 'AdminPenggunaEdit',
        component: AdminPenggunaEdit,
      },
    ]
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
