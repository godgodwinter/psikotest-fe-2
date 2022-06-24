<script setup>
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref, watch, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter, useRoute } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";

import { useStoreGuruBk } from "@/stores/guruBk";
const storeGuruBk = useStoreGuruBk();
const sekolah = computed(() => storeGuruBk.getSekolah);
storeGuruBk.$subscribe((mutation, state) => {
  // console.log(sekolah.value.id);
});

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("buletin");
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const dataAsli = ref([]);
const data = ref([]);

const getData = async () => {
  try {
    const response = await Api.get(`guest/data/buletin/${id}`);
    dataAsli.value = response.data;
    data.value = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
getData();
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between" v-if="data">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Detail Buletin Psikologi</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content>
          Buletin Psikologi <BreadCrumbSpace /> Index
        </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-gray-700 shadow-sm"
      ></span>
    </div>
    <div class="md:py-0 py-4 space-x-2 space-y-2">
      <span @click="router.go(-1)">
        <button
          class="btn hover:shadow-lg shadow text-white hover:text-gray-100 gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Kembali
        </button></span
      >
    </div>
  </div>

  <div class="w-full lg:w-full">
    <div class="bg-white shadow rounded-lg px-4 py-2">
      <div class="overflow-x-auto px-4 space-y-10 py-2">
        <div class="space-y-2">
          <h1 class="text-lg font-bold text-gray-700 py-2 bg-gray-100 shadow">
            Judul
          </h1>

          <div class="space-y-2 border-b-2 py-2">
            <p class="indent-8 text-gray-700">{{ data.nama }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full lg:w-full">
    <div class="bg-white shadow rounded-lg px-4 py-2">
      <div class="overflow-x-auto px-4 space-y-10 py-2">
        <div class="space-y-2">
          <h1 class="text-lg font-bold text-gray-700 py-2 bg-gray-100 shadow">
            Link
          </h1>

          <div class="space-y-2 border-b-2 py-2">
            <p class="indent-8 text-gray-700">{{ data.link }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full lg:w-full">
    <div class="bg-white shadow rounded-lg px-4 py-2">
      <div class="overflow-x-auto px-4 space-y-10 py-2">
        <div class="space-y-2">
          <h1 class="text-lg font-bold text-gray-700 py-2 bg-gray-100 shadow">
            File
          </h1>

          <div class="space-y-2 border-b-2 py-2">
            <p class="indent-8 text-gray-700">{{ data.file }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
