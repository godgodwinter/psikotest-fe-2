<script setup>
import Api from "@/axios/axios";
import { ref } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("hasilpsikologi");
const router = useRouter();

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

const dataAsli = ref([]);
const dataKelas = ref([]);
const data = ref([]);

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
    label: "Hasil Deteksi",
    field: "deteksi",
    type: "String",
  },
  {
    label: "Penanganan Masalah Deteksi",
    field: "penanganan",
    type: "String",
  },
  {
    label: "Sertifikat",
    field: "sertifikat",
    type: "String",
  },
  {
    label: "Kecerdasan Majemuk",
    field: "kecerdasanmajemuk",
    type: "String",
  },
  {
    label: "Terapis Karakter Positif",
    field: "terapis",
    type: "String",
  },
];

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

const getData = async () => {
  try {
    const response = await Api.get(`gurubk/hasilpsikologi`);
    dataAsli.value = response.data;
    data.value = response.data;

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
getData();

const doEditData = async (id) => {
  router.push({ name: "AdminSiswaEdit", params: { id } });
};

const doPilihKelas = () => {
  if (inputCariKelas.value.id === "Semua Kelas") {
    data.value = dataAsli.value.map((item, index) => {
      return {
        ...item,
        nama: item.nama,
        username: item.username,
        passworddefault: item.passworddefault,
      };
    });
  } else if (inputCariKelas.value.id === "Belum masuk Kelas") {
    let dataFiltered = dataAsli.value.filter((item) => {
      return item.kelas === null;
    });
    data.value = dataFiltered.map((item, index) => {
      return {
        ...item,
        nama: item.nama,
        kelas_nama: "Belum Masuk Kelas",
        username: item.username,
        passworddefault: item.passworddefault,
      };
    });
  } else {
    let dataFiltered = dataAsli.value.filter((item) => {
      return item.kelas_id == inputCariKelas.value.id;
    });
    data.value = dataFiltered.map((item, index) => {
      return {
        ...item,
        nama: item.nama,
        username: item.username,
        passworddefault: item.passworddefault,
      };
    });
  }
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Hasil Psikologi Siswa</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Siswa <BreadCrumbSpace /> Index </template>
      </BreadCrumb>
    </div>
  </div>
  <div class="flex justify-between w-full px-10">
    <div class="w-full md:w-1/2 bg-base-100 pt-4 px-4">
      <div class="flex justify-start gap-2">
        <v-select
          class="pt-2 px-3 w-72 mx-auto md:mx-0"
          :options="pilihKelas"
          v-model="inputCariKelas"
          v-bind:class="{ disabled: false }"
        ></v-select>
        <div class="pt-2">
          <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
            Cari
          </button>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex justify-end"></div>
  </div>

  <div class="md:py-0 px-4 lg:flex flex-wrap gap-4">
    <div class="w-full lg:w-full">
      <div class="shadow rounded-lg px-4 py-4">
        <div v-if="data">
          <vue-good-table
            :columns="columns"
            :rows="data"
            :search-options="{
              enabled: true,
            }"
            :pagination-options="{
              enabled: true,
              perPageDropdown: [10, 20, 50],
            }"
            styleClass="vgt-table striped bordered condensed"
            class="py-0"
          >
            <template #table-row="props">
              <span v-if="props.column.field == 'actions'">
                <div
                  class="text-sm font-medium text-center flex justify-center"
                >
                  <ButtonEdit @click="doEditData(props.row.id, props.index)" />
                </div>
              </span>

              <span v-else-if="props.column.field == 'no'">
                <div class="text-center">{{ props.index + 1 }}</div>
              </span>
              <span v-else-if="props.column.field == 'deteksi'">
                <div v-if="props.row.deteksi > 0" class="flex justify-center">
                  <router-link
                    :to="{
                      name: 'AdminHasilPsikologiDeteksi',
                      params: { id: props.row.id },
                    }"
                  >
                    <button
                      data-tip="Detail"
                      class="tooltip btn btn-success btn-sm text-base-content"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg></button
                  ></router-link>
                </div>
                <div v-else class="flex justify-center">
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-base-content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </button>
                </div>
              </span>
              <span v-else-if="props.column.field == 'penanganan'">
                <div v-if="props.row.deteksi > 0" class="flex justify-center">
                  <router-link
                    :to="{
                      name: 'AdminHasilPsikologiPenanganan',
                      params: { id: props.row.id },
                    }"
                  >
                    <button
                      data-tip="Detail"
                      class="tooltip btn btn-success btn-sm text-base-content"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg></button
                  ></router-link>
                </div>
                <div v-else class="flex justify-center">
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-base-content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </button>
                </div>
              </span>
              <span v-else-if="props.column.field == 'sertifikat'">
                <div
                  v-if="props.row.sertifikat > 0"
                  class="flex justify-center"
                >
                  <router-link
                    :to="{
                      name: 'AdminHasilPsikologiSertifikat',
                      params: { id: props.row.id },
                    }"
                  >
                    <button
                      data-tip="Detail"
                      class="tooltip btn btn-success btn-sm text-base-content"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg></button
                  ></router-link>
                </div>
                <div v-else class="flex justify-center">
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-base-content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </button>
                </div>
              </span>
              <span v-else-if="props.column.field == 'kecerdasanmajemuk'">
                <div
                  class="text-sm font-medium text-center flex justify-center"
                >
                  <div v-if="props.row.sertifikat > 0">
                    <router-link
                      :to="{
                        name: 'AdminHasilPsikologiKecerdasanMajemuk',
                        params: { id: props.row.id },
                      }"
                    >
                      <button
                        data-tip="Kecerdasan Majemuk"
                        class="tooltip btn btn-success btn-sm text-base-content"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg></button
                    ></router-link>
                  </div>
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-base-content"
                    v-else
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </button>
                </div>
              </span>
              <span v-else-if="props.column.field == 'terapis'">
                <div
                  v-if="props.row.sertifikat > 0"
                  class="flex justify-center"
                >
                  <router-link
                    :to="{
                      name: 'AdminHasilPsikologiTerapis',
                      params: { id: props.row.id },
                    }"
                  >
                    <button
                      data-tip="Detail"
                      class="tooltip btn btn-success btn-sm text-base-content"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg></button
                  ></router-link>
                </div>
                <div v-else class="flex justify-center">
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-base-content"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </button>
                </div>
              </span>

              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>
