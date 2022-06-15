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
// hasilpsikologi
import AdminHasilPsikologi from '../views/admin/hasilpsikologi/Index.vue'
import AdminHasilPsikologiDeteksi from '../views/admin/hasilpsikologi/Deteksi.vue'
import AdminHasilPsikologiPenanganan from '../views/admin/hasilpsikologi/Penanganan.vue'
// import AdminHasilPsikologiSertifikat from '../views/admin/hasilpsikologi/Sertifikat_backup.vue'
import AdminHasilPsikologiSertifikat from '../views/admin/hasilpsikologi/Sertifikat.vue'
import AdminHasilPsikologiTerapis from '../views/admin/hasilpsikologi/Terapis.vue'
// nilaipsikologi
import AdminNilaiPsikologi from '../views/admin/nilaipsikologi/Index.vue'
import AdminAnalisaMinatBakat from '../views/admin/analisaminatbakat/Index.vue'
import AdminAnalisaPenjurusan from '../views/admin/analisanpenjurusan/Index.vue'
// catatan
import AdminCatatanKasus from '../views/admin/catatankasus/Index.vue'
import AdminCatatanKasusPersiswa from '../views/admin/catatankasus/Persiswa.vue'
import AdminCatatanPengembangandiri from '../views/admin/catatanpengembangandiri/Index.vue'
import AdminCatatanPengembangandiriPersiswa from '../views/admin/catatanpengembangandiri/Persiswa.vue'
import AdminCatatanPrestasi from '../views/admin/catatanprestasi/Index.vue'
import AdminCatatanPrestasiPersiswa from '../views/admin/catatanprestasi/Persiswa.vue'

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
        path: '/pages/datakelas/tambah',
        name: 'AdminKelasTambah',
        component: () => import("@/views/admin/kelas/Tambah.vue"),
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
        path: '/pages/datawalikelas/tambah',
        name: 'AdminWaliKelasTambah',
        component: () => import("@/views/admin/walikelas/Tambah.vue"),
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
      {
        path: '/pages/hasilpsikologi',
        name: 'AdminHasilPsikologi',
        component: AdminHasilPsikologi,
      },
      {
        path: '/pages/hasilpsikologi/deteksi/:id',
        name: 'AdminHasilPsikologiDeteksi',
        component: AdminHasilPsikologiDeteksi,
      },
      {
        path: '/pages/hasilpsikologi/penanganan/:id',
        name: 'AdminHasilPsikologiPenanganan',
        component: AdminHasilPsikologiPenanganan,
      },
      {
        path: '/pages/hasilpsikologi/sertifikat/:id',
        name: 'AdminHasilPsikologiSertifikat',
        component: AdminHasilPsikologiSertifikat,
      },
      {
        path: '/pages/hasilpsikologi/terapis/:id',
        name: 'AdminHasilPsikologiTerapis',
        component: AdminHasilPsikologiTerapis,
      },
      {
        path: '/pages/nilaipsikologi',
        name: 'AdminNilaiPsikologi',
        component: AdminNilaiPsikologi,
      },
      {
        path: '/pages/analisaminatbakat',
        name: 'AdminAnalisaMinatBakat',
        component: AdminAnalisaMinatBakat,
      },
      {
        path: '/pages/analisanpenjurusan',
        name: 'AdminAnalisaPenjurusan',
        component: AdminAnalisaPenjurusan,
      },
      {
        path: '/pages/catatan/kasus',
        name: 'AdminCatatanKasus',
        component: AdminCatatanKasus,
      },
      {
        path: '/pages/catatan/kasus/:id',
        name: 'AdminCatatanKasusPersiswa',
        component: AdminCatatanKasusPersiswa,
      },
      {
        path: '/pages/catatan/kasus/:id/tambah',
        name: 'AdminCatatanKasusPersiswaTambah',
        component: () => import("@/views/admin/catatankasus/PersiswaTambah.vue"),
      },
      {
        path: '/pages/catatan/kasus/:id/edit/:id2',
        name: 'AdminCatatanKasusPersiswaEdit',
        component: () => import("@/views/admin/catatankasus/PersiswaEdit.vue"),
      },
      {
        path: '/pages/catatan/pengembangandiri',
        name: 'AdminCatatanPengembangandiri',
        component: AdminCatatanPengembangandiri,
      },
      {
        path: '/pages/catatan/pengembangandiri/:id',
        name: 'AdminCatatanPengembangandiriPersiswa',
        component: AdminCatatanPengembangandiriPersiswa,
      },
      {
        path: '/pages/catatan/prestasi',
        name: 'AdminCatatanPrestasi',
        component: AdminCatatanPrestasi,
      },
      {
        path: '/pages/catatan/prestasi/:id',
        name: 'AdminCatatanPrestasiPersiswa',
        component: AdminCatatanPrestasiPersiswa,
      },
    ]
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
