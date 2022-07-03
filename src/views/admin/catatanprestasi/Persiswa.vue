<script setup>
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref, watch, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter, useRoute } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
import Toast from "@/components/lib/Toast.js";
import ButtonDelete from "@/components/atoms/ButtonDel.vue";

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

const dataAsli = ref([]);
const dataKelas = ref([]);
const data = ref([]);
const dataSiswa = ref([]);

const columns = [
  {
    label: "Actions",
    field: "actions",
    sortable: false,
    width: "50px",
    tdClass: "text-center",
    thClass: "text-center",
  },
  {
    label: "Prestasi",
    field: "prestasi",
    type: "String",
  },
  {
    label: "Teknik Belajar",
    field: "teknikbelajar",
    type: "String",
  },
  {
    label: "Saranan Belajar",
    field: "saranabelajar",
    type: "String",
  },
  {
    label: "Penulis",
    field: "penulis",
    type: "String",
  },
];

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

const doEditData = async (id2) => {
  router.push({
    name: "AdminCatatanPrestasiPersiswaEdit",
    params: { id, id2 },
  });
};

const encode = (value) => window.btoa(value);

const doCetak = (id = null, token = moment().format("YYYY-MM-DD")) => {
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

const doDeleteData = async (dataId, index) => {
  if (confirm("Apakah anda yakin menghapus data ini?")) {
    try {
      const response = await Api.delete(
        `gurubk/catatan/prestasi/${id}/data/${dataId}`
      );
      data.value.splice(index, 1);
      Toast.success("Success", "Data Berhasil dihapus!");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >{{ dataSiswa.nama }}</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Prestasi <BreadCrumbSpace /> Index </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <router-link
        :to="{
          name: 'AdminCatatanPrestasiPersiswaTambah',
          params: { id },
        }"
      >
        <buttton class="btn btn-primary">Tambah</buttton>
      </router-link>
      <a @click="doCetak(id)">
        <button class="btn btn-sm">
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>
      </a>
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

  <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
    <div class="w-full lg:w-full">
      <div class="bg-white shadow rounded-lg px-4 py-4">
        <div v-if="data">
          <vue-good-table
            line-numbers="true"
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
                <div>
                  <div v-if="props.row.penulis == 'admin'"></div>
                  <div
                    v-else-if="props.row.penulis == 'gurubk'"
                    class="text-sm font-medium text-center flex justify-center space-x-0"
                  >
                    <ButtonEdit
                      @click="doEditData(props.row.id, props.index)"
                    />
                    <ButtonDelete
                      @click="doDeleteData(props.row.id, props.index)"
                    />
                  </div>
                  <div v-else></div>
                </div>
              </span>

              <span v-else-if="props.column.field == 'no'">
                <div class="text-center">{{ props.index + 1 }}</div>
              </span>

              <span v-else-if="props.column.field == 'penulis'">
                <div class="text-center">
                  <p v-if="props.row.penulis == 'admin'">Admin</p>
                  <p v-else-if="props.row.penulis == 'gurubk'">Sekolah</p>
                  <p v-else>Ortu / Walimurid</p>
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
