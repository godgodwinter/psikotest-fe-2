<script setup>
import Api from "@/axios/axios";
import { ref } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { Field, Form } from "vee-validate";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useRouter, useRoute } from "vue-router";
import Toast from "@/components/lib/Toast.js";
const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("kelas");

let pilihWaliKelas = ref([]);

const router = useRouter();
const route = useRoute();

const dataAsli = ref([]);
const dataKelas = ref([]);
const data = ref([]);
const dataDetail = ref([]);

const inputCariKelas = ref({
  label: "Semua Kelas",
  id: "Semua Kelas",
});

// const getDataId = async () => {
//   try {
//     const response = await Api.get(`gurubk/kelas/${route.params.id}`);
//     dataAsli.value = response.data;
//     dataDetail.value = {
//       nama: response.data.nama,
//       walikelas_id: {
//         label: `${response.data.walikelas_nama}`,
//         id: response.data.walikelas_id,
//       },
//     };

//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };
// getDataId();

const id = route.params.id;

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
    nama: dataDetail.value.nama,
    walikelas_id: dataDetail.value.walikelas_id.id,
  };
  try {
    const response = await Api.post(`gurubk/kelas`, dataStore);
    Toast.success("Success", "Data Berhasil update!");
    // resetForm();
    router.push({ name: "AdminKelas" });

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal diupdate!");
    console.error(error);
  }
};

const getDataWaliKelas = async () => {
  try {
    const response = await Api.get(`gurubk/walikelas`);
    getDataWaliKelas.value = response.data;
    getDataWaliKelas.value.forEach((item) => {
      pilihWaliKelas.value.push({
        label: `${item.nama} (${item.jml_kelas} Kelas)`,
        id: item.id,
      });
    });
  } catch (error) {
    console.error(error);
  }
};
getDataWaliKelas();
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
      >
        {{ dataAsli.nama }}</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Kelas <BreadCrumbSpace /> Tambah </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="pt-4 px-10 md:flex justify-between">
    <div></div>
    <div class="md:py-0 py-4 space-x-2 space-y-2">
      <router-link :to="{ name: 'AdminKelas' }">
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
        </button></router-link
      >
    </div>
  </div>

  <div class="px-4 py-4">
    <div class="w-full">
      <div class="bg-base-100 shadow rounded-lg px-0 py-4">
        <div class="w-full lg:w-fi mx-4">
          <div class="p-2 sm:p-6 xl:p-8">
            <Form v-slot="{ errors }" @submit="onSubmit" v-if="data">
              <div class="pt-0 px-0">
                <div class="w-full mx-0">
                  <div class="bg-base-100 rounded-lg p-0 sm:p-6 xl:p-0">
                    <div class="grid md:grid-cols-2 gap-2">
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
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
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Walikelas</label
                        >
                        <v-select
                          class="py-2 px-3 w-72 mx-auto md:mx-0"
                          :options="pilihWaliKelas"
                          v-model="dataDetail.walikelas_id"
                          v-bind:class="{ disabled: false }"
                        ></v-select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.walikelas_id }}
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
