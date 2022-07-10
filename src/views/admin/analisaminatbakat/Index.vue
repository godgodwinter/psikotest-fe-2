<script setup>
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref, watch, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";

import { useStoreGuruBk } from "@/stores/guruBk";
const storeGuruBk = useStoreGuruBk();
const sekolah = computed(() => storeGuruBk.getSekolah);
storeGuruBk.$subscribe((mutation, state) => {
  // console.log(sekolah.value.id);
});

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("minatbakat");
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
    label: "Minat Pekerjaan 1",
    field: "minat_pekerjaan_1",
    type: "String",
  },
]);

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
    const response = await Api.get(`gurubk/hasilpsikologi/withdetail`);
    dataAsli.value = response.data;
    // data.value = response.data;
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
        kelas: item.kelas_nama,
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
getData();

const doEditData = async (id) => {
  router.push({ name: "AdminSiswaEdit", params: { id } });
};

const doPilihKelas = () => {
  data.value = [];
  if (inputCariKelas.value.id === "Semua Kelas") {
    // data.value = dataAsli.value.map((item, index) => {
    //   return {
    //     ...item,
    //     nama: item.nama,
    //     kelas_nama: item.kelas_nama,
    //   };
    // });

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
        kelas: item.kelas_nama,
      });

      ListTampilkan.value.forEach((listItem) => {
        data.value[index][listItem.id] = tempDataList[listItem.id];
      });
    });
  } else if (inputCariKelas.value.id === "Belum masuk Kelas") {
    let dataFiltered = dataAsli.value.filter((item) => {
      return item.kelas === null;
    });
    // data.value = dataFiltered.map((item, index) => {
    //   return {
    //     ...item,
    //     nama: item.nama,
    //     kelas_nama: "Belum Masuk Kelas",
    //   };
    // });

    if (dataFiltered.length > 0) {
      dataFiltered.forEach((item, index) => {
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
          kelas_nama: "Belum Masuk Kelas",
        });

        ListTampilkan.value.forEach((listItem) => {
          data.value[index][listItem.id] = tempDataList[listItem.id];
        });
      });
    } else {
      data.value = [];
    }
  } else {
    let dataFiltered = dataAsli.value.filter((item) => {
      return item.kelas_id == inputCariKelas.value.id;
    });

    if (dataFiltered.length > 0) {
      dataFiltered.forEach((item, index) => {
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
          kelas: item.kelas_nama,
        });

        ListTampilkan.value.forEach((listItem) => {
          data.value[index][listItem.id] = tempDataList[listItem.id];
        });
      });
    } else {
      data.value = [];
    }
  }
};

// seleksi yang ditampilkan
const ListTampilkan = ref([
  { label: "Minat Pekerjaan 1", id: "minat_pekerjaan_1", checked: true },
  { label: "Minat Pekerjaan 2", id: "minat_pekerjaan_2", checked: false },
  { label: "Minat Pekerjaan 3", id: "minat_pekerjaan_3", checked: false },
  { label: "Cita Cita 1", id: "mnt_cita2_1", checked: false },
  { label: "Cita Cita 2", id: "mnt_cita2_2", checked: false },
  { label: "Cita Cita 3", id: "mnt_cita2_3", checked: false },
  { label: "Hobi", id: "hobi", checked: false },
  { label: "Pekerjaan Bapak", id: "pekerjaanbapak", checked: false },
  { label: "Pekerjaan Ibu", id: "pekerjaanibu", checked: false },
  { label: "Pekerjaan Kakek", id: "pekerjaankakek", checked: false },
  { label: "Analisa Pekerjaan", id: "analisapekerjaan", checked: false },
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

const listData = ref("kb_persen");
watch(ListTampilkan.value, (newValue, oldValue) => {
  listData.value = [];
  ListTampilkan.value.forEach((item, index) => {
    if (item.checked) {
      listData.value.push(item.id);
    }
  });
});
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Analisa Minat dan Bakat
      </span>
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
        <a
          :href="
            BASE_URL +
            'api/admin/proses/export/datasiswa/' +
            sekolah.id +
            '/get?listdata=' +
            listData
          "
          target="_blank"
        >
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
            class="flex justify-center gap-2 w-full lg:w-10/12 2xl:w-full flex-wrap py-2"
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
    <div class="w-full lg:w-10/12 2xl:w-full">
      <div class="bg-base-200 shadow rounded-lg px-4 py-4">
        <div v-if="data">
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
            <template #table-row="props">
              <span v-if="props.column.field == 'actions'">
                <div
                  class="text-sm font-medium text-center flex justify-center space-x-1"
                >
                  <router-link
                    :to="{
                      name: 'AdminAnalisaMinatBakatTambah',
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
                      </svg></button
                  ></router-link>
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
