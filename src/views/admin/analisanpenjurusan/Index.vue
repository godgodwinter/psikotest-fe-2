<script setup>
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:8000/";
import Api from "@/axios/axios";
import { ref, watch, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter, useRoute } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useStoreGuruBk } from "@/stores/guruBk";
import Toast from "@/components/lib/Toast";
const storeGuruBk = useStoreGuruBk();
const sekolah = computed(() => storeGuruBk.getSekolah);
storeGuruBk.$subscribe((mutation, state) => {
  // console.log(sekolah.value.id);
});

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("penjurusan");
const router = useRouter();
const route = useRoute();

const kelas_id = ref(route.params.kelas_id ? route.params.kelas_id : 0);
const dataAsli = ref([]);
const data = ref([]);
const dataKelas = ref([]);
let pilihKelas = ref([]);
const sekolah_id = storeGuruBk.getIdentitas ? storeGuruBk.getIdentitas.sekolah_id : null;

const inputCariKelas = ref();

const getDataKelas = async () => {
  try {
    const response = await Api.get(`gurubk/kelas`);
    // console.log(response);
    dataKelas.value = response.data;
    if (dataKelas.value.length > 0) {
      // console.log(dataKelas.value[0].id);
      if (kelas_id.value == 0) {
        kelas_id.value = dataKelas.value[0].id;
      }
      dataKelas.value.forEach((item) => {
        pilihKelas.value.push({
          label: item.nama,
          id: item.id,
        });
      });
      // console.log(kelas_id.value);
      getData(kelas_id.value);
    }
    return response;
  } catch (error) {
    Toast.danger("Warning", "Data Gagal dimuat");
    console.error(error);
  }
};
getDataKelas();

const doPilihKelas = () => {
  // console.log(inputCariKelas.value.id);
  if (inputCariKelas.value) {
    router.push({
      name: "AdminAnalisaPenjurusan",
      params: {
        kelas_id: inputCariKelas.value.id,
      },
    });
    fnSetToTempSekolah(sekolah_id, inputCariKelas.value.id, inputCariKelas.value.label);
    getData(inputCariKelas.value.id);
  } else {
    Toast.danger("Warning", "Pilih Kelas Terlebih Dahulu");
  }
};

const getData = async (kelas_id) => {
  try {
    dataAsli.value = [];
    data.value = [];
    linkExport.value =
      BASE_URL +
      "api/admin/proses/export/datasiswa/" +
      sekolah.value.id +
      "/kelas/" +
      kelas_id +
      "/get?listdata=" +
      listData.value;
    const response = await Api.get(
      `gurubk/hasilpsikologi/withdetail/${kelas_id}`
    );
    dataAsli.value = response.data;

    dataAsli.value.forEach((item, index) => {
      let tempDataList = {};
      if (item.sertifikat_data) {
        ListTampilkan.value.forEach((listItem) => {
          tempDataList[listItem.id] = item.sertifikat_data[listItem.id];
        });
      }
      // console.log(tempDataList);
      data.value.push({
        ...item,
        nama: item.nama,
        id: item.id,
        kelas: `${item.kelas ? item.kelas.nama : ""}`,
      });

      ListTampilkan.value.forEach((listItem) => {
        data.value[index][listItem.id] = tempDataList[listItem.id];
      });
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const listData = ref("tipe_bakat_1");
const linkExport = ref(
  BASE_URL +
    "api/admin/proses/export/datasiswa/" +
    sekolah.value.id +
    "/kelas/" +
    kelas_id.value +
    "/get?listdata=" +
    listData.value
);

const columns = ref([
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
    label: "Kelas",
    field: "kelas_nama",
    type: "String",
  },
  {
    label: "Tipe Minat - Bakat Rank 1",
    field: "tipe_bakat_1",
    type: "String",
  },
]);

// seleksi yang ditampilkan
const ListTampilkan = ref([
  { label: "Tipe Minat - Bakat Rank 1", id: "tipe_bakat_1", checked: true },
  { label: "Tipe Minat - Bakat Rank 2", id: "tipe_bakat_2", checked: false },
  { label: "Tipe Minat - Bakat Rank 3", id: "tipe_bakat_3", checked: false },
  {
    label: "Studi lanjut dari SMP yg diinginkan",
    id: "mnt_studi_lanjut_smp",
    checked: false,
  },
  {
    label: "Jurusan SMA yg diinginkan",
    id: "mnt_studi_lanjut_sma",
    checked: false,
  },
  {
    label: "Jurusan SMK yg diinginkan 1",
    id: "mnt_studi_lanjut_smk_1",
    checked: false,
  },
  {
    label: "Jurusan SMK yg diinginkan 2",
    id: "mnt_studi_lanjut_smk_2",
    checked: false,
  },
  {
    label: "Jurusan SMK yg diinginkan 3",
    id: "mnt_studi_lanjut_smk_3",
    checked: false,
  },
  {
    label: "Disarankan Jurusan 1",
    id: "saran_fakultas_1",
    checked: false,
  },
  {
    label: "Dipertimbangkan Jurusan 2",
    id: "saran_fakultas_2",
    checked: false,
  },
  {
    label: "Tidak Disarankan Jurusan 3",
    id: "kesimpulan_tambahan",
    checked: false,
  },
  {
    label: "Studi Lanjut SMA/SMK Fakultas 1",
    id: "mnt_studi_lanjut_sma_smk_1_fakultas",
    checked: false,
  },
  {
    label: "Studi Lanjut SMA/SMK Prodi 1",
    id: "mnt_studi_lanjut_sma_smk_1_prodi",
    checked: false,
  },
  {
    label: "Studi Lanjut SMA/SMK Fakultas 2",
    id: "mnt_studi_lanjut_sma_smk_2_fakultas",
    checked: false,
  },
  {
    label: "Studi Lanjut SMA/SMK Prodi 2",
    id: "mnt_studi_lanjut_sma_smk_2_prodi",
    checked: false,
  },
  {
    label: "Studi Lanjut SMA/SMK Kedinasan",
    id: "mnt_studi_lanjut_sma_smk_kedinasan",
    checked: false,
  },
  {
    label: "Sekolah Lanjutan",
    id: "sekolah_lanjutan",
    checked: false,
  },
  {
    label: "Sekolah Jurusan",
    id: "sekolah_jurusan",
    checked: false,
  },
  {
    label: "Saran ke Studi Atas 1/Fakultas 1",
    id: "saran_fakultas_1",
    checked: false,
  },
  {
    label: "Saran ke Jurusan Studi Atas 1/Fakultas Prodi 1",
    id: "saran_fakultas_1_prodi",
    checked: false,
  },
  {
    label: "Saran ke Studi Atas 2/Fakultas 2",
    id: "saran_fakultas_2",
    checked: false,
  },
  {
    label: "Saran ke Jurusan Studi Atas 2/Fakultas Prodi 2",
    id: "saran_fakultas_2_prodi",
    checked: false,
  },
  {
    label: "Keterangan",
    id: "keterangan",
    checked: false,
  },
]);

const onToggleList = (index) => {
  ListTampilkan.value[index].checked = !ListTampilkan.value[index].checked;

  if (ListTampilkan.value[index].checked) {
    columns.value.push({
      label: ListTampilkan.value[index].label,
      field: ListTampilkan.value[index].id,
      type: ListTampilkan.value[index].type
        ? ListTampilkan.value[index].type
        : "String",
    });
  } else {
    columns.value.forEach((item, index2) => {
      if (item.field === ListTampilkan.value[index].id) {
        columns.value.splice(index2, 1);
      }
    });
  }
};

watch(ListTampilkan.value, (newValue, oldValue) => {
  listData.value = [];
  ListTampilkan.value.forEach((item, index) => {
    if (item.checked) {
      listData.value.push(item.id);
    }
  });
  linkExport.value =
    BASE_URL +
    "api/admin/proses/export/datasiswa/" +
    sekolah.value.id +
    "/kelas/" +
    kelas_id.value +
    "/get?listdata=" +
    listData.value;
});
const getTempSekolah = computed(() => storeGuruBk.getTempSekolah);

const fnCariDataTempSekolahWhereSekolahId = (id) => {
  let tempSekolah = storeGuruBk.getTempSekolah;
  console.log(id, tempSekolah);
  return tempSekolah ? tempSekolah.filter((item) => item.id == id) : [];
}

const getDataSekolah = fnCariDataTempSekolahWhereSekolahId(sekolah_id);
// console.log('====================================');
// console.log(sekolah_id);
// console.log('====================================');

const fnSetToTempSekolah = (sekolah_id, kelas_id, nama_kelas) => {
  let obj = {
    id: sekolah_id,
    kelas_id: kelas_id,
    nama_kelas: nama_kelas,
  }
  // console.log("objek", obj);
  let temp = getTempSekolah.value;
  console.log("temp", temp);
  if (temp.length > 0) {
    let periksa = temp.filter((x) => x.id == obj.id);
    console.log("periksa:", periksa)
    if (periksa.length > 0) {
      temp.forEach((x, index) => {
        if (x.id == obj.id) {
          x.kelas_id = obj.kelas_id,
            x.nama_kelas = obj.nama_kelas
        }
      })
    } else {
      temp.push(obj);
    }
  } else {
    temp.push(obj);
  }
  // console.log(temp);
  // console.log(getTempSekolah);
  storeGuruBk.setTempSekolah(temp)
}
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
<<<<<<< HEAD
      <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">Analisa Penjurusan kelas
        <!-- {{getDataSekolah }} -->
        {{
        getDataSekolah.length>0?getDataSekolah[0].nama_kelas:null }}
      </span>
=======
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Analisa Penjurusan</span
      >
>>>>>>> 4acbc3b0949cec48889c3a718b0de5b7603896d7
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
        <a :href="linkExport" target="_blank">
          <button
            class="btn hover:shadow-lg btn-success shadow text-white hover:text-gray-100 gap-2"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Export
          </button>
        </a>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex justify-end"></div>
  </div>
  <div
    class="w-full lg:w-10/12 2xl:w-10/12 bg-base-200 shadow shadow-md py-4 px-4"
  >
    <div class="flex justify-center gap-2 w-full flex-wrap">
      <div class="collapse">
        <input type="checkbox" />
        <div
          class="collapse-title text-xl font-medium bg-gray-300 rounded-lg text-gray-600 text-center"
        >
          List Pilihan Data
        </div>
        <div class="collapse-content">
          <div
            class="flex justify-center gap-2 w-full lg:w-10/12 2xl:w-10/12 flex-wrap py-2"
          >
            <div v-for="(item, index) in ListTampilkan">
              <div class="form-control">
                <label
                  class="cursor-pointer label"
                  @click="onToggleList(index)"
                >
                  <span class="label-text px-2">{{ item.label }}</span>
                  <input
                    type="checkbox"
                    :checked="item.checked"
                    class="checkbox checkbox-secondary"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="md:py-2 px-4 lg:flex flex-wrap gap-4">
    <div class="w-full lg:w-10/12 2xl:w-10/12">
      <div class="bg-base-200 shadow rounded-lg px-4 py-4">
        <div v-if="data">
<<<<<<< HEAD
          <vue-good-table :line-numbers="true" :columns="columns" :rows="data" :search-options="{
            enabled: true,
          }" :pagination-options="{
            enabled: true,
            perPageDropdown: [10, 20, 50],
          }" styleClass="vgt-table striped bordered condensed" class="py-0">
=======
          <vue-good-table
            :line-numbers="true"
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
>>>>>>> 4acbc3b0949cec48889c3a718b0de5b7603896d7
            <template #table-row="props">
              <span v-if="props.column.field == 'actions'">
                <div
                  class="text-sm font-medium text-center flex justify-center space-x-1"
                >
                  <router-link
                    :to="{
                      name: 'AdminAnalisaPenjurusanTambah',
                      params: { id: props.row.id },
                    }"
                  >
                    <button class="btn btn-sm btn-primary">
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
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </router-link>
                </div>
              </span>
              <span v-else-if="props.column.field == 'nama'">
                <div class="text-left">{{ props.row.nama }}</div>
              </span>
              <span v-else-if="props.column.field == 'kelas_nama'">
                <div class="text-left">{{ props.row.kelas_nama }}</div>
              </span>

              <span v-else>
                <div
                  v-if="props.row.sertifikat == null"
                  class="flex justify-center"
                >
                  <button
                    data-tip="Data API PRO BK tidak ditemukan"
                    class="tooltip btn btn-warning btn-sm text-gray-100"
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
                <div v-else>
                  <div class="text-center">
                    {{ props.formattedRow[props.column.field] }}
                  </div>
                </div>
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>
