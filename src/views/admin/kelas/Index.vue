<script setup>
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import ButtonDel from "@/components/atoms/ButtonDel.vue";
import { useRouter } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
import Toast from "@/components/lib/Toast.js";

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("kelas");
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
    label: "Nama ",
    field: "nama",
    type: "String",
  },
  {
    label: "Nama Walikelas",
    field: "walikelas_nama",
    type: "String",
  },
  {
    label: "Guru BK",
    field: "bk_nama",
    type: "String",
  },
  {
    label: "Jumlah Siswa",
    field: "jml_siswa",
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
    const response = await Api.get(`gurubk/kelas`);
    dataAsli.value = response.data;
    data.value = response.data;

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
getData();

const doEditData = async (id) => {
  router.push({ name: "AdminKelasEdit", params: { id } });
};

const doDeleteData = async (id, index) => {
  if (confirm("Apakah anda yakin menghapus data ini?")) {
    try {
      const response = await Api.delete(`gurubk/kelas/${id}`);
      data.value.splice(index, 1);
      Toast.success("Success", "Data Berhasil dihapus!");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
};

const encode = (value) => window.btoa(value);

const doCetak = (id = null, token = moment().format("YYYY-MM-DD")) => {
  // Toast.success("Success", token);
  if (id === null) {
    Toast.danger("Warning", "Data tidak valid!");
  } else {
    window.open(
      `${BASE_URL}api/guest/cetak/siswaperkelas/${encode(id)}?token=${encode(
        token
      )}`
    );
  }
};
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Kelas</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Kelas <BreadCrumbSpace /> Index </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <router-link :to="{ name: 'AdminKelasTambah' }">
        <button
          class="btn btn-primary hover:shadow-lg shadow text-white hover:text-gray-100 gap-2"
        >
          Tambah
        </button></router-link
      >
    </div>
    <div class="md:py-0 py-4 space-x-2 space-y-2"></div>
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
                  <a @click="doCetak(props.row.id)">
                    <button class="btn btn-sm mr-2">
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
                  <ButtonEdit @click="doEditData(props.row.id, props.index)" />
                  <ButtonDel @click="doDeleteData(props.row.id, props.index)" />
                </div>
              </span>

              <span v-else-if="props.column.field == 'no'">
                <div class="text-center">{{ props.index + 1 }}</div>
              </span>
              <span v-else-if="props.column.field == 'jml_siswa'">
                <div class="text-left">{{ props.row.jml_siswa }} Siswa</div>
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
