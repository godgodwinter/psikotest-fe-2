<script setup>
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);
const BASE_URL = import.meta.env.VITE_API_URL;
import Api from "@/axios/axios";
import { ref, computed } from "vue";
import BreadCrumb from "@/components/atoms/BreadCrumb.vue";
import BreadCrumbSpace from "@/components/atoms/BreadCrumbSpace.vue";
import ButtonEdit from "@/components/atoms/ButtonEdit.vue";
import { useRouter, useRoute } from "vue-router";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useStoreGuruBk } from "@/stores/guruBk";
import Toast from "@/components/lib/Toast.js";

const storeAdminBar = useStoreAdminBar();
const storeGuruBk = useStoreGuruBk();
// storeGuruBk.$subscribe((mutation, state) => {
//   // console.log(sekolah.value.id);

//   // let getDataSekolahSub = fnCariDataTempSekolahWhereSekolahId(id);
//   // kelas_id.value = getDataSekolahSub.length > 0 ? getDataSekolahSub[0].kelas_id : null;
//   getDataSekolah.value = fnCariDataTempSekolahWhereSekolahId(sekolah_id);
// });
storeAdminBar.setPagesActive("siswa");
const router = useRouter();
const route = useRoute();

const kelas_id = ref(route.params.kelas_id ? route.params.kelas_id : 0);

let pilihKelas = ref([]);

const dataAsli = ref([]);
const dataKelas = ref([]);
const data = ref([]);
const sekolah_id = storeGuruBk.getIdentitas ? storeGuruBk.getIdentitas.sekolah_id : null;


// get Kelas
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
// console.log(kelas_id.value);
const inputCariKelas = ref();

const doPilihKelas = () => {
  // console.log(inputCariKelas.value.id);
  if (inputCariKelas.value) {
    router.push({
      name: "AdminSiswa",
      params: {
        kelas_id: inputCariKelas.value.id,
      },
    });
    // console.log('====================================');
    // console.log(sekolah_id, inputCariKelas.value.id, inputCariKelas.value.label);
    // console.log('====================================');
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
    const response = await Api.get(
      `gurubk/datasiswa/kelas/${kelas_id}`
    );
    dataAsli.value = response.data;

    data.value = response.data;

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
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
  {
    label: "Username Ortu",
    field: "ortu_username",
    type: "String",
  },
  {
    label: "Password Default Ortu",
    field: "ortu_passworddefault",
    type: "String",
  },
];



const doEditData = async (id) => {
  router.push({ name: "AdminSiswaEdit", params: { id } });
};

const doCopyClipboard = (item) => {
  navigator.clipboard.writeText(item);
  Toast.babeng("Info", `${item} berhasil disalin`);
};

// const encode = (value) => window.btoa(value);

// const doCetak = (id = null, token = moment().format("YYYY-MM-Do")) => {
//   console.log(inputCariKelas.value);
//   // if (id === null) {
//   //   Toast.danger("Warning", "Data tidak valid!");
//   // } else {
//   //   window.open(
//   //     `${BASE_URL}api/guest/cetak/catatankasus/${encode(id)}?token=${encode(
//   //       token
//   //     )}`
//   //   );
//   // }
// };


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
      <span class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm">Siswa kelas
        <!-- {{getDataSekolah }} -->
        {{
        getDataSekolah.length>0?getDataSekolah[0].nama_kelas:null }}
      </span>
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Siswa
          <!-- {{ sekolah_id }} -->
          <BreadCrumbSpace /> Index
        </template>
      </BreadCrumb>
    </div>
  </div>
  <div class="flex justify-between w-full px-10">
    <div class="w-full md:w-1/2 bg-base-100 pt-4 px-4">
      <div class="flex justify-start gap-2">
        <v-select class="pt-2 px-3 w-72 mx-auto md:mx-0" :options="pilihKelas" v-model="inputCariKelas"
          v-bind:class="{ disabled: false }"></v-select>
        <div class="pt-2">
          <button class="btn btn-sm btn-info p-2" @click="doPilihKelas()">
            Cari
          </button>

          <!-- <button
            class="btn hover:shadow-lg btn-success shadow text-white hover:text-gray-100 gap-2"
            @click="doCetak()"
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
          </button> -->
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex justify-end"></div>
  </div>

  <div class="md:py-0 px-4 lg:flex flex-wrap gap-4">
    <div class="w-full lg:w-full">
      <div class="shadow rounded-lg px-4 py-4">
        <div v-if="data">
          <vue-good-table :columns="columns" :rows="data" :search-options="{
            enabled: true,
          }" :pagination-options="{
            enabled: true,
            perPageDropdown: [10, 20, 50],
          }" styleClass="vgt-table striped bordered condensed" class="py-0">
            <template #table-row="props">
              <span v-if="props.column.field == 'actions'">
                <div class="text-sm font-medium text-center flex justify-center">
                  <ButtonEdit @click="doEditData(props.row.id, props.index)" />
                </div>
              </span>

              <span v-else-if="props.column.field == 'no'">
                <div class="text-center">{{ props.index + 1 }}</div>
              </span>
              <span v-else-if="props.column.field == 'username'">
                <div class="flex justify-center gap-2">
                  <div class="text-center">{{ props.row.username }}</div>
                  <span v-if="props.row.username" @click="doCopyClipboard(props.row.username)"
                    class="hover:text-primary cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </span>
                </div>
              </span>
              <span v-else-if="props.column.field == 'passworddefault'">
                <div class="flex justify-center gap-2">
                  <div class="text-center">{{ props.row.passworddefault }}</div>
                  <span v-if="props.row.passworddefault" @click="doCopyClipboard(props.row.passworddefault)"
                    class="hover:text-primary cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </span>
                </div>
              </span>
              <span v-else-if="props.column.field == 'ortu_username'">
                <div class="flex justify-center gap-2">
                  <div class="text-center">{{ props.row.ortu_username }}</div>
                  <span v-if="props.row.ortu_username" @click="doCopyClipboard(props.row.ortu_username)"
                    class="hover:text-primary cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </span>
                </div>
              </span>
              <span v-else-if="props.column.field == 'ortu_passworddefault'">
                <div class="flex justify-center gap-2">
                  <div class="text-center">
                    {{ props.row.ortu_passworddefault }}
                  </div>
                  <span v-if="props.row.ortu_passworddefault" @click="doCopyClipboard(props.row.ortu_passworddefault)"
                    class="hover:text-primary cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </span>
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
