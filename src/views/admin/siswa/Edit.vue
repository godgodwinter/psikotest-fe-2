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
storeAdminBar.setPagesActive("siswa");

let pilihKelas = ref([
  {
    label: "Semua Kelas",
    id: "Semua Kelas",
  },
  {
    label: "Belum masuk Kelas",
    id: "Belum masuk Kelas",
  },
]);

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

const columns = [
  {
    label: "No",
    field: "no",
    width: "50px",
    tdClass: "text-center",
    thClass: "text-center",
  },
  {
    label: "Actions",
    field: "actions",
    sortable: false,
    width: "50px",
    tdClass: "text-center",
    thClass: "text-center",
  },
  {
    label: "Nama Siswa",
    field: "nama",
    type: "String",
  },
  {
    label: "NIS",
    field: "nomeridentitas",
    type: "String",
  },
  {
    label: "Kelas",
    field: "kelas_nama",
    type: "String",
  },
  {
    label: "Username",
    field: "username",
    type: "String",
  },
  {
    label: "Password Default",
    field: "passworddefault",
    type: "String",
  },
];

const getDataId = async () => {
  try {
    const response = await Api.get(`gurubk/siswa/${route.params.id}`);
    dataAsli.value = response.data;
    dataDetail.value = {
      nama: response.data.nama,
      nomeridentitas: response.data.nomeridentitas,
      alamat: response.data.alamat,
      jk: response.data.jk,
      kelas_id: {
        label: `${response.data.kelas_nama}`,
        id: response.data.kelas_id,
      },
      tempatlahir: response.data.tempatlahir,
      tgllahir: response.data.tgllahir,
      usia: response.data.usia,
      agama: response.data.agama,
      anak: response.data.anak,
      kandung: response.data.kandung,
      angkat: response.data.angkat,
      tiri: response.data.tiri,
      statusanak: response.data.statusanak,
      bahasa: response.data.bahasa,
      tinggal: response.data.tinggal,
      jarak: response.data.jarak,
      telp: response.data.telp,
    };

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
getDataId();

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
    nomeridentitas: dataDetail.value.nomeridentitas,
    alamat: dataDetail.value.alamat,
    jk: dataDetail.value.jk,
    kelas_id: dataDetail.value.kelas_id.id,
    tempatlahir: dataDetail.value.tempatlahir,
    tgllahir: dataDetail.value.tgllahir,
    usia: dataDetail.value.usia,
    agama: dataDetail.value.agama,
    anak: dataDetail.value.anak,
    kandung: dataDetail.value.kandung,
    angkat: dataDetail.value.angkat,
    tiri: dataDetail.value.tiri,
    statusanak: dataDetail.value.statusanak,
    bahasa: dataDetail.value.bahasa,
    tinggal: dataDetail.value.tinggal,
    jarak: dataDetail.value.jarak,
    telp: dataDetail.value.telp,
  };
  try {
    const response = await Api.put(`gurubk/siswa/${id}`, dataStore);
    Toast.success("Success", "Data Berhasil update!");
    // resetForm();
    router.push({ name: "AdminSiswa" });

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal diupdate!");
    console.error(error);
  }
};

const getDataKelas = async () => {
  try {
    const response = await Api.get(`gurubk/kelas`);
    dataKelas.value = response.data;
    dataKelas.value.forEach((item) => {
      pilihKelas.value.push({
        label: `${item.nama} (${item.jml_siswa} siswa)`,
        id: item.id,
      });
    });
  } catch (error) {
    console.error(error);
  }
};
getDataKelas();
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
        <template v-slot:content> Siswa <BreadCrumbSpace /> Edit </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="pt-4 px-10 md:flex justify-between">
    <div></div>
    <div class="md:py-0 py-4 space-x-2 space-y-2">
      <router-link :to="{ name: 'AdminSiswa' }">
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
                          >NISN</label
                        >
                        <Field
                          v-model="dataDetail.nomeridentitas"
                          type="text"
                          name="nomeridentitas"
                          ref="nomeridentitas"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.nomeridentitas }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Kelas</label
                        >
                        <v-select
                          class="py-2 px-3 w-72 mx-auto md:mx-0"
                          :options="pilihKelas"
                          v-model="dataDetail.kelas_id"
                          v-bind:class="{ disabled: false }"
                        ></v-select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.nama }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Tempat Lahir</label
                        >
                        <Field
                          v-model="dataDetail.tempatlahir"
                          type="text"
                          name="tempatlahir"
                          ref="tempatlahir"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tempatlahir }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Tanggal Lahir</label
                        >
                        <Datepicker
                          v-model="dataDetail.tgllahir"
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
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tgllahir }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Usia</label
                        >
                        <Field
                          v-model="dataDetail.usia"
                          type="text"
                          name="usia"
                          ref="usia"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.usia }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Alamat</label
                        >
                        <Field
                          v-model="dataDetail.alamat"
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
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >No. Handphone</label
                        >
                        <Field
                          v-model="dataDetail.telp"
                          type="text"
                          name="telp"
                          ref="telp"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.telp }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Jenis Kelamin</label
                        >
                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetail.jk"
                        >
                          <option disabled selected>Pilih ?</option>
                          <option>Laki-laki</option>
                          <option>Perempuan</option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.jk }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Agama</label
                        >
                        <Field
                          v-model="dataDetail.agama"
                          type="text"
                          name="agama"
                          ref="agama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.agama }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Anak ke</label
                        >
                        <Field
                          v-model="dataDetail.anak"
                          type="text"
                          name="anak"
                          ref="anak"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.anak }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Jumlah Saudara Kandung</label
                        >
                        <Field
                          v-model="dataDetail.kandung"
                          type="text"
                          name="kandung"
                          ref="kandung"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kandung }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Jumlah Saudara Angkat</label
                        >
                        <Field
                          v-model="dataDetail.angkat"
                          type="text"
                          name="angkat"
                          ref="angkat"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.angkat }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Jumlah Saudara Tiri</label
                        >
                        <Field
                          v-model="dataDetail.tiri"
                          type="text"
                          name="tiri"
                          ref="tiri"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tiri }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Status Anak</label
                        >
                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetail.statusanak"
                        >
                          <option disabled selected>Pilih ?</option>
                          <option>Lengkap</option>
                          <option>Yatim</option>
                          <option>Piatu</option>
                          <option>Yatim Piatu</option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.statusanak }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Bahasa Sehari-Hari Dirumah</label
                        >
                        <Field
                          v-model="dataDetail.bahasa"
                          type="text"
                          name="bahasa"
                          ref="bahasa"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.bahasa }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Tinggal Dengan</label
                        >
                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetail.tinggal"
                        >
                          <option disabled selected>Pilih ?</option>
                          <option>Orang Tua</option>
                          <option>Saudara</option>
                          <option>Asrama/Kost</option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tinggal }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-gray-900 block mb-2"
                          >Jarak Ke Sekolah</label
                        >
                        <Field
                          v-model="dataDetail.jarak"
                          type="text"
                          name="jarak"
                          ref="jarak"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.jarak }}
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
