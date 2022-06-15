<script setup>
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref, watch, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter, useRoute } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
import { Field, Form } from "vee-validate";
import Toast from "@/components/lib/Toast.js";

import { useStoreGuruBk } from "@/stores/guruBk";
const storeGuruBk = useStoreGuruBk();
const sekolah = computed(() => storeGuruBk.getSekolah);
storeGuruBk.$subscribe((mutation, state) => {
  // console.log(sekolah.value.id);
});

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("prestasi");
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const id2 = route.params.id2;

const dataAsli = ref([]);
const data = ref([]);
const dataSiswa = ref([]);
const dataDetail = ref([]);

const getData = async () => {
  try {
    const response = await Api.get(`gurubk/catatan/prestasi/${id}`);
    dataAsli.value = response.data;
    data.value = response.data;
    dataSiswa.value = response.siswa;

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
getData();

const encode = (value) => window.btoa(value);

const doCetak = (id = null, token = moment().format("YYYY-MM-Do")) => {
  if (id === null) {
    Toast.danger("Warning", "Data tidak valid!");
  } else {
    window.open(
      `${BASE_URL}api/guest/cetak/catatanprestasi/${encode(id)}?token=${encode(
        token
      )}`
    );
  }
};

const onSubmit = () => {
  const res = doStoreData();
};

const doStoreData = async (d) => {
  let dataStore = {
    tanggal: dataDetail.value.tanggal,
    prestasi: dataDetail.value.prestasi,
    teknikbelajar: dataDetail.value.teknikbelajar,
    saranabelajar: dataDetail.value.saranabelajar,
    penunjangbelajar: dataDetail.value.penunjangbelajar,
    kesimpulandansaran: dataDetail.value.kesimpulandansaran,
  };
  try {
    const response = await Api.post(`gurubk/catatan/prestasi/${id}`, dataStore);
    Toast.success("Success", "Data Berhasil ditambahkan!");
    // resetForm();
    router.push({
      name: "AdminCatatanPrestasiPersiswa",
      params: { id, id2 },
    });

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between" v-if="dataSiswa">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >{{ dataSiswa.nama }}</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Kasus <BreadCrumbSpace /> Tambah </template>
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

  <div class="px-4 py-4">
    <div class="w-full">
      <div class="bg-white shadow rounded-lg px-0 py-4">
        <div class="w-full lg:w-fi mx-4">
          <div class="p-2 sm:p-6 xl:p-8">
            <Form v-slot="{ errors }" @submit="onSubmit" v-if="data">
              <div class="pt-0 px-0">
                <div class="w-full mx-0">
                  <div class="bg-white rounded-lg p-0 sm:p-6 xl:p-0">
                    <div class="grid md:grid-cols-2 gap-2">
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Tanggal</label
                        >
                        <Datepicker
                          v-model="dataDetail.tanggal"
                          format="yyyy/MM/dd"
                          value-format="yyyy-MM-dd"
                          :rules="validateData"
                          required
                        >
                          <template #calendar-header="{ index, day }">
                            <div
                              :class="
                                index === 5 || index === 6 ? 'red-color' : ''
                              "
                            >
                              {{ day }}
                            </div>
                          </template>
                        </Datepicker>
                        <!-- <Field
                          v-model="dataDetail.tanggal"
                          :rules="validateData"
                          type="text"
                          name="tanggal"
                          ref="tanggal"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        /> -->
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tanggal }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Prestasi</label
                        >
                        <Field
                          v-model="dataDetail.prestasi"
                          :rules="validateData"
                          type="text"
                          name="prestasi"
                          ref="prestasi"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.prestasi }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Teknik Belajar</label
                        >
                        <Field
                          v-model="dataDetail.teknikbelajar"
                          :rules="validateData"
                          type="text"
                          name="teknikbelajar"
                          ref="teknikbelajar"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.teknikbelajar }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Saran Belajar</label
                        >
                        <Field
                          v-model="dataDetail.saranabelajar"
                          :rules="validateData"
                          type="text"
                          name="saranabelajar"
                          ref="saranabelajar"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.saranabelajar }}
                        </div>
                      </div>

                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Penunjang Belajar</label
                        >
                        <Field
                          v-model="dataDetail.penunjangbelajar"
                          :rules="validateData"
                          type="text"
                          name="penunjangbelajar"
                          ref="penunjangbelajar"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.penunjangbelajar }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Kesimpulan dan Saran</label
                        >
                        <textarea
                          v-model="dataDetail.kesimpulandansaran"
                          class="textarea textarea-accent md:w-full max-w-2xl"
                          placeholder=""
                        ></textarea>

                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kesimpulandansaran }}
                        </div>
                      </div>
                    </div>

                    <div class="w-full flex justify-end mt-4 px-20">
                      <button class="btn btn-active btn-lg btn-primary">
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
