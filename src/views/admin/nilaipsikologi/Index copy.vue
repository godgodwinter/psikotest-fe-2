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
  console.log(sekolah.value.id);
});

const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("nilaipsikologi");
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
    label: "No",
    field: "no",
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
    label: "Kecerdasan Bahasa/Lingustik",
    field: "kb_persen",
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
  { label: "Kecerdasan Bahasa/Lingustik", id: "kb_persen", checked: true },
  {
    label: "Keterangan Kecerdasan Bahasa/Lingustik",
    id: "kbh",
    checked: false,
  },
  { label: "Kecerdasan Logis-Matematis", id: "lm_persen", checked: false },
  { label: "Keterangan Kecerdasan Logis-Matematis", id: "lmh", checked: false },
  { label: "Kecerdasan Spasial", id: "ks_persen", checked: false },
  { label: "Keterangan Kecerdasan Spasial", id: "ksh", checked: false },
  { label: "Kecerdasan Musikal", id: "km_persen", checked: false },
  { label: "Keterangan Kecerdasan Musikal", id: "kmh", checked: false },
  { label: "Kecerdasan Kinestik", id: "kk_persen", checked: false },
  { label: "Keterangan Kecerdasan Kinestik", id: "kkh", checked: false },
  { label: "Kecerdasan Interpersonal", id: "ki_persen", checked: false },
  { label: "Keterangan Kecerdasan Interpersonal", id: "kih", checked: false },
  { label: "Kecerdasan Intrapersonal", id: "ka_persen", checked: false },
  { label: "Keterangan Kecerdasan Intrapersonal", id: "kah", checked: false },
  { label: "Kecerdasan Natural", id: "kn_persen", checked: false },
  { label: "Keterangan Kecerdasan Natural", id: "knh", checked: false },
  { label: "Intelligence Quotient", id: "iq", checked: false },
  {
    label: "Persentase Intelligence Quotient",
    id: "iq_persen",
    checked: false,
  },
  { label: "Keterangan Intelligence Quotient", id: "iqh", checked: false },
  { label: "Persentase Emotional Quotient", id: "eq_persen", checked: false },
  {
    label: "Keterangan Emotional Quotient",
    id: "eq_persen_keterangan",
    checked: false,
  },
  { label: "Persentase Spiritual Quotient", id: "sq_persen", checked: false },
  {
    label: "Keterangan Spiritual Quotient",
    id: "sq_persen_keterangan",
    checked: false,
  },
  { label: "Persentase Social Quotient", id: "scq_persen", checked: false },
  {
    label: "Keterangan Social Quotient",
    id: "scq_persen_keterangan",
    checked: false,
  },
  { label: "Sikap Hangat", id: "hspq_a_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Hangat",
    id: "hspq_a_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Dingin", id: "hspq_a_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Dingin",
    id: "hspq_a_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Emosi Stabil", id: "hspq_c_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Emosi Stabil",
    id: "hspq_c_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Emosi Labil", id: "hspq_c_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Emosi Labil",
    id: "hspq_c_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Bergairah", id: "hspq_d_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Bergairah",
    id: "hspq_d_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Sulit Bergairah", id: "hspq_d_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Sulit Bergairah",
    id: "hspq_d_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Dominasi", id: "hspq_e_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Dominasi",
    id: "hspq_e_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Patuh Tunduk", id: "hspq_e_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Patuh Tunduk",
    id: "hspq_e_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Keceriaan", id: "hspq_f_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Keceriaan",
    id: "hspq_f_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Sungguh-sungguh", id: "hspq_f_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Sungguh-sungguh",
    id: "hspq_f_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Taat Peraturan", id: "hspq_g_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Taat Peraturan",
    id: "hspq_g_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Menolak Peraturan", id: "hspq_g_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Menolak Peraturan",
    id: "hspq_g_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Lembuht Hati/Peka", id: "hspq_h_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Lembuht Hati/Peka",
    id: "hspq_h_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Keras Hati", id: "hspq_h_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Keras Hati",
    id: "hspq_h_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Pemberani", id: "hspq_i_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Pemberani",
    id: "hspq_i_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Pemalu", id: "hspq_i_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Pemalu",
    id: "hspq_i_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Menarik Diri", id: "hspq_j_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Menarik Diri",
    id: "hspq_j_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Bersemangat", id: "hspq_j_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Bersemangat",
    id: "hspq_j_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Ketakutan", id: "hspq_o_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Ketakutan",
    id: "hspq_o_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Percaya Diri", id: "hspq_o_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Percaya Diri",
    id: "hspq_o_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Mandiri", id: "hspq_q2_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Mandiri",
    id: "hspq_q2_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Kurang Mandiri", id: "hspq_q2_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Kurang Mandiri",
    id: "hspq_q2_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Disiplin", id: "hspq_q3_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Disiplin",
    id: "hspq_q3_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Kurang Disiplin", id: "hspq_q3_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Kurang Disiplin",
    id: "hspq_q3_kr_keterangan",
    checked: false,
  },
  { label: "Sikap Tegang", id: "hspq_q4_kn_persen", checked: false },
  {
    label: "Keterangan Sikap Tegang",
    id: "hspq_q4_kn_keterangan",
    checked: false,
  },
  { label: "Sikap Rileks/Santai", id: "hspq_q4_kr_persen", checked: false },
  {
    label: "Keterangan Sikap Rileks/Santai",
    id: "hspq_q4_kr_keterangan",
    checked: false,
  },
  { label: "Kepribadian Terkuat Rank 1", id: "hspq_rank_1", checked: false },
  { label: "Kepribadian Terkuat Rank 2", id: "hspq_rank_2", checked: false },
  { label: "Kepribadian Terkuat Rank 3", id: "hspq_rank_3", checked: false },
  { label: "Kepribadian Terkuat Rank 4", id: "hspq_rank_4", checked: false },
  { label: "Kepribadian Terkuat Rank 5", id: "hspq_rank_5", checked: false },
  {
    label: "Rank 1 Faktor Kepribadian Terkuat Positif",
    id: "hspq_rank_1_positif",
    checked: false,
  },
  {
    label: "Rank 2 Faktor Kepribadian Terkuat Positif",
    id: "hspq_rank_2_positif",
    checked: false,
  },
  {
    label: "Rank 3 Faktor Kepribadian Terkuat Positif",
    id: "hspq_rank_3_positif",
    checked: false,
  },
  {
    label: "Rank 4 Faktor Kepribadian Terkuat Positif",
    id: "hspq_rank_4_positif",
    checked: false,
  },
  {
    label: "Rank 5 Faktor Kepribadian Terkuat Positif",
    id: "hspq_rank_5_positif",
    checked: false,
  },
  {
    label: "Rank 1 Faktor Kepribadian Terkuat Negatif",
    id: "hspq_rank_1_negatif",
    checked: false,
  },
  {
    label: "Rank 2 Faktor Kepribadian Terkuat Negatif",
    id: "hspq_rank_2_negatif",
    checked: false,
  },
  {
    label: "Rank 3 Faktor Kepribadian Terkuat Negatif",
    id: "hspq_rank_3_negatif",
    checked: false,
  },
  {
    label: "Rank 4 Faktor Kepribadian Terkuat Negatif",
    id: "hspq_rank_4_negatif",
    checked: false,
  },
  {
    label: "Rank 5 Faktor Kepribadian Terkuat Negatif",
    id: "hspq_rank_5_negatif",
    checked: false,
  },
  {
    label: "Minat Pekerjaan Rank 1",
    id: "minat_pekerjaan_1_persen",
    checked: false,
  },
  {
    label: "Minat Pekerjaan Rank 2",
    id: "minat_pekerjaan_2_persen",
    checked: false,
  },
  {
    label: "Minat Pekerjaan Rank 3",
    id: "minat_pekerjaan_3_persen",
    checked: false,
  },
]);

const onToggleList = (index) => {
  ListTampilkan.value[index].checked = !ListTampilkan.value[index].checked;

  if (ListTampilkan.value[index].checked) {
    columns.value.push({
      label: ListTampilkan.value[index].label,
      field: ListTampilkan.value[index].id,
      // field: `siswadetailwithsertifikat.apiprobkwithsertifikat.apiprobk_sertifikat.${ListTampilkan.value[index].id}`,
      // field: `siswadetailwithsertifikat`,
      type: "String",
    });
  } else {
    columns.value.forEach((item, index2) => {
      if (item.field === ListTampilkan.value[index].id) {
        columns.value.splice(index2, 1);
      }
    });
  }

  // console.log("====================================");
  // console.log(
  //   index,
  //   ListTampilkan.value[index].label,
  //   ListTampilkan.value[index].id,
  //   ListTampilkan.value[index].checked
  // );
  // console.log("====================================");
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
        >Nilai Psikologi Siswa</span
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
  <div class="w-full bg-white shadow shadow-md py-4 px-4">
    <div class="flex justify-center gap-2 w-full flex-wrap">
      <div class="collapse">
        <input type="checkbox" />
        <div
          class="collapse-title text-xl font-medium bg-gray-300 rounded-lg text-gray-600 text-center"
        >
          List Pilihan Data
        </div>
        <div class="collapse-content">
          <div class="flex justify-center gap-2 w-full flex-wrap py-2">
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
              <span v-if="props.column.field == 'no'">
                <div class="text-center">{{ props.index + 1 }}</div>
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
