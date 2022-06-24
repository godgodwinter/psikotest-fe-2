<script setup>
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import Toast from "@/components/lib/Toast";
import { ref, watch, computed } from "vue";
import { Field, Form } from "vee-validate";
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
storeAdminBar.setPagesActive("penjurusan");
const router = useRouter();
const route = useRoute();

const dataAsli = ref([]);
const dataKelas = ref([]);
const data = ref([]);

const dataDetail = ref({});

const id = route.params.id;

const getDataId = async () => {
  try {
    const response = await Api.get(`gurubk/datasiswa/${id}/penjurusan`);
    dataDetail.value = {
      keterangan: response.data.keterangan,
    };
    data.value = response.siswa;
    // console.log(data.value);
    return response;
  } catch (error) {
    Toast.danger("Warning", "Data Gagal dimuat");
    console.error(error);
  }
};

getDataId();
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
const onSubmit = () => {
  const res = doStoreData();
};
const doStoreData = async (d) => {
  let dataStore = {
    keterangan: dataDetail.value.keterangan,
  };
  try {
    const response = await Api.post(
      `gurubk/datasiswa/${id}/penjurusan`,
      dataStore
    );
    // resetForm();
    router.push({
      name: "AdminAnalisaPenjurusan",
    });

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};
const resetForm = () => {
  dataDetail.value = {};
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Analisa Penjurusan : {{ data.nama }}</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content>
          Penjurusan <BreadCrumbSpace /> Tambah
        </template>
      </BreadCrumb>
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
                          >Keterangan</label
                        >
                        <Field
                          v-model="dataDetail.keterangan"
                          :rules="validateData"
                          type="text"
                          name="keterangan"
                          ref="keterangan"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.keterangan }}
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
