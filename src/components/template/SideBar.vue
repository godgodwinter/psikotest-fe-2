<script setup>
import { computed } from "vue";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useStoreAuth } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const storeAdminBar = useStoreAdminBar();
const isSideBarActive = computed(() => storeAdminBar.getIsSidebarActive);
const pagesActive = computed(() => storeAdminBar.getPagesActive);
async function goLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLogin");
  router.go();
}
const storeAuth = useStoreAuth();
const getIsLogin = computed(() => storeAuth.getIsLogin);
// const getToken = computed(() => storeAuth.getToken);
if (getIsLogin.value == false) {
  //logout
  router.push({ name: "LandingLogin" });
}
const pagesActiveClass = ref(
  "border border-primary rounded-lg bg-primary text-primary-content"
);
</script>
<template>
  <aside
    :class="{ hidden: !isSideBarActive }"
    id="sidebar"
    class="fixed z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 lg:w-72 border transition-width duration-75 bg-base-200"
    aria-label="Sidebar"
  >
    <div
      class="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 pt-6 md:pt-4"
    >
      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div class="flex-1 px-3 divide-y space-y-1">
          <ul
            class="space-y-2 pb-2 lg:flex flex-wrap px-2 gap-2 justify-center"
          >
            <li class="lg:w-full">
              <div class="flex gap-2 items-center justify-center">
                <!-- <img
                  src="@/assets/img/avatar/baemon-ava-2.jpg"
                  alt=""
                  class="rounded-full w-20 h-20 object-cover"
                /> -->
                <!-- <div class="avatar">
                  <div class="w-24 mask mask-squircle">
                    <img src="@/assets/img/avatar/baemon-ava-2.jpg" />
                  </div>
                </div> -->
                <div class="avatar online">
                  <div
                    class="w-24 rounded-full border border-sky-200 hover:border-sky-400 shadow hover:shadow-lg"
                  >
                    <img src="@/assets/img/avatar/baemon-ava-2.jpg" />
                  </div>
                </div>
              </div>
              <div>
                <p class="text-gray-800 text-md font-semibold text-center py-2">
                  Paijo
                </p>
                <p class="text-gray-500 text-sm font-medium text-center">
                  Admin
                </p>
              </div>
            </li>
            <li class="lg:w-full flex justify-center">
              <button
                @click="goLogout()"
                class="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 group border border-2 border-slate-400 hover:border-slate-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3 text-sm">Logout </span>
              </button>
            </li>
          </ul>
          <ul
            class="space-y-2 pb-2 lg:flex flex-wrap px-2 gap-0 justify-between"
          >
            <li
              class="lg:w-full py-2"
              :class="[pagesActive == 'dashboard' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
                <span class="ml-3">Dashboard </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Siswa </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Kelas </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Wali Kelas </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Pengguna </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Hasil Psikologi </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Nilai Psikologi Siswa </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Analisa Minat dan Bakat </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Analisa Penjurusan </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Catatan Kasus Siswa </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Catatan Pengembangan Diri Siswa </span>
              </router-link>
            </li>
            <li
              class="lg:w-full py-0"
              :class="[pagesActive == 'siswa' ? pagesActiveClass : '']"
            >
              <router-link
                :to="{ name: 'AdminDashboard' }"
                class="text-base-content font-normal rounded-lg flex items-center p-2 group hover:link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="ml-3">Catatan Prestasi Siswa </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>
