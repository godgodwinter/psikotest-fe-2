<script setup>
import { ref } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import { useStoreAdminBar } from "@/stores/adminBar";
const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("dashboard");
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-gray-700 shadow-sm"
        >Dashboard</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content>
          Dashboard <BreadCrumbSpace /> Index
        </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="md:px-10 py-4">
    <div class="alert alert-info shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Selamat Datang di Menu Sekolah.</span>
      </div>
    </div>
  </div>

  <div class="px-4 py-4">
    <div class="stats shadow stats-vertical md:stats-horizontal">
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Kelas</div>
        <div class="stat-value">31K</div>
        <div class="stat-desc">Last Updated : 21 Juni 2022</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Siswa</div>
        <div class="stat-value">4,200</div>
        <div class="stat-desc">Last Updated : 21 Juni 2022</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Guru</div>
        <div class="stat-value">1,200</div>
        <div class="stat-desc">Last Updated : 20 Juni 2022</div>
      </div>
    </div>
  </div>
</template>
