<script setup>
import { ref, computed, watch } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import { Field, Form } from "vee-validate";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useStoreGuruBk } from "@/stores/guruBk";

import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import Toast from "@/components/lib/Toast.js";
import { useRouter, useRoute } from "vue-router";
import Api from "@/axios/axios";
const router = useRouter();
const route = useRoute();

moment.updateLocale("id", localization);
const storeGuruBk = useStoreGuruBk();
const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("dashboard");

const getPaket = computed(() => storeGuruBk.getPaket);
const getStats = computed(() => storeGuruBk.getStats);
const getSekolah = computed(() => storeGuruBk.getSekolah);
const data = ref([]);
const dataDetail = ref({
  nama: getSekolah.value.nama,
  alamat: getSekolah.value.alamat,
  status: getSekolah.value.status ? getSekolah.value.status : "Aktif",
  kepsek_nama: getSekolah.value.kepsek_nama,
  tahunajaran_nama: getSekolah.value.tahunajaran_nama,
  semester_nama: getSekolah.value.semester_nama,
  kecamatan: getSekolah.value.kecamatan,
  kabupaten: getSekolah.value.kabupaten,
  provinsi: getSekolah.value.provinsi,
});
// validasi
const validateData = (value) => {
  if (!value) {
    return "This field is required";
  }
  if (value.length < 1) {
    return "This Field must be at least 2 characters";
  }
  return true;
};
// vue pinia watch
storeGuruBk.$subscribe((mutation, state) => {});

const onSubmit = () => {
  const res = doStoreData();
};

const doStoreData = async (d) => {
  let dataStore = {
    nama: dataDetail.value.nama,
    alamat: dataDetail.value.alamat,
    status: dataDetail.value.status ? dataDetail.value.status : "Aktif",
    kepsek_nama: dataDetail.value.kepsek_nama,
    tahunajaran_nama: dataDetail.value.tahunajaran_nama,
    semester_nama: dataDetail.value.semester_nama,
    kecamatan: dataDetail.value.kecamatan,
    kabupaten: dataDetail.value.kabupaten,
    provinsi: dataDetail.value.provinsi,
  };
  try {
    const response = await Api.post(`gurubk/myprofile/update`, dataStore);
    Toast.success("Success", "Data Berhasil update!");
    router.go();
    // resetForm();

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
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
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title">Jenis Paket :</div>
        <div class="stat-value">Kelas {{ getPaket.nama }}</div>
        <div class="stat-desc">
          Last Updated :
          {{
            moment(getSekolah.updated_at, "YYYY-MM-DD").format(" Do MMM YYYY")
          }}
          <!-- {{ getSekolah.updated_at }} -->
        </div>
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
        <div class="stat-value">{{ getStats.kelas }} Kelas</div>
        <!-- <div class="stat-desc">Last Updated : 21 Juni 2022</div> -->
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
        <div class="stat-value">{{ getStats.siswa }} Siswa</div>
        <!-- <div class="stat-desc">Last Updated : 21 Juni 2022</div> -->
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
        <div class="stat-title">Walikelas</div>
        <div class="stat-value">{{ getStats.walikelas }}</div>
        <!-- <div class="stat-desc">Last Updated : 20 Juni 2022</div> -->
      </div>
    </div>
  </div>

  <!-- <div class="px-4 py-4">
    <h3 class="font-bold">Update Profile</h3>
  </div> -->

  <!-- <div class="px-4 py-0">
    <div class="w-full">
      <div class="bg-base-100 shadow rounded-lg px-0 py-0">
        <div class="w-full lg:w-fi mx-0">
          <div class="p-2 sm:p-6 xl:p-8">
            <Form v-slot="{ errors }" @submit="onSubmit" v-if="data">
              <div class="pt-0 px-0">
                <div class="w-full mx-0">
                  <div class="rounded-lg p-0 sm:p-6 xl:p-0">
                    <div class="grid md:grid-cols-2 gap-2">
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Nama</label
                        >
                        <Field
                          v-model="dataDetail.nama"
                          :rules="validateData"
                          type="text"
                          name="nama"
                          ref="nama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.nama }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Alamat</label
                        >
                        <Field
                          v-model="dataDetail.alamat"
                          :rules="validateData"
                          type="text"
                          name="alamat"
                          ref="alamat"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.alamat }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Status</label
                        >
                        <select
                          class="select select-bordered w-full max-w-xs"
                          disabled
                        >
                          <option>Aktif</option>
                          <option>Nonaktif</option>
                        </select>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Nama Kepala Sekolah</label
                        >
                        <Field
                          v-model="dataDetail.kepsek_nama"
                          :rules="validateData"
                          type="text"
                          name="kepsek_nama"
                          ref="kepsek_nama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kepsek_nama }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Provinsi</label
                        >
                        <Field
                          v-model="dataDetail.provinsi"
                          :rules="validateData"
                          type="text"
                          name="provinsi"
                          ref="provinsi"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.provinsi }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Kabupaten</label
                        >
                        <Field
                          v-model="dataDetail.kabupaten"
                          :rules="validateData"
                          type="text"
                          name="kabupaten"
                          ref="kabupaten"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kabupaten }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Kecamatan</label
                        >
                        <Field
                          v-model="dataDetail.kecamatan"
                          :rules="validateData"
                          type="text"
                          name="kecamatan"
                          ref="kecamatan"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kecamatan }}
                        </div>
                      </div>
                    </div>

                    <div class="w-full flex justify-end mt-4 px-20">
                      <button class="btn btn-lg btn-primary">Simpan</button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <!-- <div class="px-4 py-4">
    <h3 class="font-bold">Update Photo</h3>
  </div>
  <div class="lg:flex felx-wrap gap-2 w-full px-4">
    <div class="card w-96 bg-base-100 shadow-xl">
      <figure class="px-10 pt-10">
        <img
          src="@/assets/img/logo/github-copilot.svg"
          alt="Shoes"
          class="rounded-xl text-white"
        />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title">Nama Sekolah</h2>
        <p>Alamat</p>
        <div class="card-actions">
          <button class="btn btn-primary">Update Logo Sekolah</button>
        </div>
      </div>
    </div>

    <div class="card w-96 bg-base-100 shadow-xl">
      <figure class="px-10 pt-10">
        <img
          src="@/assets/img/logo/github-copilot.svg"
          alt="Shoes"
          class="rounded-xl"
        />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title">Nama Kepala Sekolah</h2>
        <p>Alamat</p>
        <div class="card-actions">
          <button class="btn btn-primary">Update Photo Kepala Sekolah</button>
        </div>
      </div>
    </div>
  </div> -->
</template>
