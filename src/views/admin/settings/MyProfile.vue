<script setup>
import { ref, computed, watch } from "vue";
import BreadCrumb from "../../../components/atoms/BreadCrumb.vue";
import { Field, Form } from "vee-validate";
import Api from "@/axios/axios";
import Toast from "@/components/lib/Toast.js";
import { useStoreAdminBar } from "@/stores/adminBar";
import { useStoreGuruBk } from "@/stores/guruBk";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

moment.updateLocale("id", localization);
const storeGuruBk = useStoreGuruBk();
const storeAdminBar = useStoreAdminBar();
storeAdminBar.setPagesActive("dashboard");

const getPaket = computed(() => storeGuruBk.getPaket);
const getStats = computed(() => storeGuruBk.getStats);
const getSekolah = computed(() => storeGuruBk.getSekolah);
const data = ref([]);
const dataDetail = ref({
  nama: getSekolah.value.nama,
  alamat: getSekolah.value.alamat,
  status: getSekolah.value.status ? getSekolah.value.status : "Aktif",
  kepsek_nama: getSekolah.value.kepsek_nama,
  tahunajaran_nama: getSekolah.value.tahunajaran_nama,
  semester_nama: getSekolah.value.semester_nama,
  kecamatan: getSekolah.value.kecamatan,
  kabupaten: getSekolah.value.kabupaten,
  provinsi: getSekolah.value.provinsi,
});

const dataDetailTemp = ref({
  kecamatan: getSekolah.value.kecamatan,
  kabupaten: getSekolah.value.kabupaten,
  provinsi: getSekolah.value.provinsi,
});

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

// vue pinia watch
storeGuruBk.$subscribe((mutation, state) => {});

const onSubmit = () => {
  const res = doStoreData();
};

const doStoreData = async (d) => {
  let dataStore = {
    nama: dataDetail.value.nama,
    alamat: dataDetail.value.alamat,
    status: dataDetail.value.status ? dataDetail.value.status : "Aktif",
    kepsek_nama: dataDetail.value.kepsek_nama,
    tahunajaran_nama: dataDetail.value.tahunajaran_nama,
    semester_nama: dataDetail.value.semester_nama,
    kecamatan: dataDetail.value.kecamatan,
    kabupaten: dataDetail.value.kabupaten,
    provinsi: dataDetail.value.provinsi,
  };
  try {
    const response = await Api.post(`gurubk/myprofile/update`, dataStore);
    Toast.success("Success", "Data Berhasil update!");
    // router.go();
    // resetForm();

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};

const isPasswordSama = ref(false);
const doAlertPasswordTidakSama = () => {
  Toast.warning("Info", "Gagal! Password tidak sama!");
};

const dataForm2 = ref({
  password: "",
  password_confirmation: "",
});
const periksaPassword = () => {
  //   Toast.success("Info", `tes ${dataForm2.value.password}`);
  if (dataForm2.value.password != "") {
    if (dataForm2.value.password != dataForm2.value.password_confirmation) {
      isPasswordSama.value = false;
      //   doAlertPasswordTidakSama();
    } else {
      //   Toast.success("Info", "Password sama!");
      isPasswordSama.value = true;
    }
  }
};

const validateDataForm2 = (value) => {
  if (!value) {
    return "This field is required";
  }
  if (value.length < 3) {
    return "This Field must be at least 2 characters";
  }
  return true;
};
const onSubmitForm2 = () => {
  const res = doStoreDataForm2();
};

const doStoreDataForm2 = async (d) => {
  let dataStore = {
    password: dataForm2.value.password,
  };
  try {
    const response = await Api.post(
      `gurubk/myprofile/updatepassword`,
      dataStore
    );
    Toast.success("Success", "Data Berhasil update!");
    // router.go();
    // resetForm();

    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};

const listProvinsi = ref([]);

const listKabupaten = ref([]);

const listKecamatan = ref([]);

// https://dev.farizdotid.com/api/daerahindonesia/provinsi
const getProvinsi = async () => {
  try {
    const response = await Api.get(
      `https://dev.farizdotid.com/api/daerahindonesia/provinsi`
    );
    response.provinsi.forEach((element) => {
      let tempDAta = {
        code: element.id,
        label: element.nama,
      };
      listProvinsi.value.push(tempDAta);
    });
    // console.log(response, listProvinsi.value);
    return response.provinsi;
  } catch (error) {
    console.error(error);
  }
};

const fnGetLabelProvinci = (id) => {
  let label = "";
  listProvinsi.value.forEach((element) => {
    if (element.code == id) {
      label = element.label;
    }
  });
  return label;
};
const fnGetLabelKabupaten = (id) => {
  let label = "";
  listKabupaten.value.forEach((element) => {
    if (element.code == id) {
      label = element.label;
    }
  });
  return label;
};
const fnGetLabelKecamatan = (id) => {
  let label = "";
  listKecamatan.value.forEach((element) => {
    if (element.code == id) {
      label = element.label;
    }
  });
  return label;
};

const getKabupaten = async (e) => {
  dataDetail.value.provinsi = fnGetLabelProvinci(e.target.value);
  //   console.log(fnGetLabelProvinci(e.target.value));
  //   console.log(e.target.value);
  let id = e.target.value;
  try {
    const response = await Api.get(
      `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id}`
    );
    // console.log(response.kota_kabupaten);
    listKabupaten.value = [
      {
        code: "0",
        label: "-",
      },
    ];

    response.kota_kabupaten.forEach((element) => {
      let tempDAta = {
        code: element.id,
        label: element.nama,
      };
      listKabupaten.value.push(tempDAta);
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}
const getKecamatan = async (e) => {
  dataDetail.value.kabupaten = fnGetLabelKabupaten(e.target.value);
  //   console.log(fnGetLabelKabupaten(e.target.value));
  //   console.log(e.target.value);
  let id = e.target.value;
  try {
    const response = await Api.get(
      `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${id}`
    );
    // console.log(response.kecamatan);

    listKecamatan.value = [
      {
        code: "0",
        label: "-",
      },
    ];

    response.kecamatan.forEach((element) => {
      let tempDAta = {
        code: element.id,
        label: element.nama,
      };
      listKecamatan.value.push(tempDAta);
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const setKecamatan = async (e) => {
  dataDetail.value.kecamatan = fnGetLabelKecamatan(e.target.value);
  //   console.log(dataDetail.value.kecamatan, fnGetLabelKecamatan(e.target.value));
  //   console.log(e.target.value, listKecamatan.value);
  //   let id = e.target.value;
};

getProvinsi();
</script>
<template>
  <div class="pt-4 px-10 md:flex justify-between">
    <div>
      <span
        class="text-2xl sm:text-3xl leading-none font-bold text-base-content shadow-sm"
        >Profile</span
      >
    </div>
    <div class="md:py-0 py-4">
      <BreadCrumb>
        <template v-slot:content> Profile <BreadCrumbSpace /> Index </template>
      </BreadCrumb>
    </div>
  </div>

  <div class="px-4 py-0">
    <div class="w-full">
      <div class="bg-base-100 shadow rounded-lg px-0 py-0">
        <div class="w-full lg:w-fi mx-0">
          <div class="p-2 sm:p-6 xl:p-8">
            <Form v-slot="{ errors }" @submit="onSubmit" v-if="data">
              <div class="pt-0 px-0">
                <div class="w-full mx-0">
                  <div class="rounded-lg p-0 sm:p-6 xl:p-0">
                    <div class="grid md:grid-cols-2 gap-2">
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
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
                          class="text-sm font-medium text-base-content block mb-2"
                          >Alamat</label
                        >
                        <Field
                          v-model="dataDetail.alamat"
                          :rules="validateData"
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
                          class="text-sm font-medium text-base-content block mb-2"
                          >Status</label
                        >
                        <select
                          class="select select-bordered w-full max-w-xs"
                          disabled
                        >
                          <!-- <option disabled selected>Pilih Status ?</option> -->
                          <option>Aktif</option>
                          <option>Nonaktif</option>
                        </select>
                        <!-- <div class="text-xs text-red-600 mt-1">
                          {{ errors.status }}
                        </div> -->
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Nama Kepala Sekolah</label
                        >
                        <Field
                          v-model="dataDetail.kepsek_nama"
                          :rules="validateData"
                          type="text"
                          name="kepsek_nama"
                          ref="kepsek_nama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kepsek_nama }}
                        </div>
                      </div>
                      <!-- <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Tahun Ajaran</label
                        >
                        <Field
                          v-model="dataDetail.tahunajaran_nama"
                          :rules="validateData"
                          type="text"
                          name="tahunajaran_nama"
                          ref="tahunajaran_nama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.tahunajaran_nama }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Semester</label
                        >
                        <Field
                          v-model="dataDetail.semester_nama"
                          :rules="validateData"
                          type="text"
                          name="semester_nama"
                          ref="semester_nama"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.semester_nama }}
                        </div>
                      </div> -->
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Provinsi</label
                        >

                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetailTemp.provinsi"
                          @change="getKabupaten($event)"
                        >
                          <option selected>
                            {{ getSekolah.provinsi }}
                          </option>
                          <option
                            v-for="item in listProvinsi"
                            :key="item.code"
                            :value="item.code"
                          >
                            {{ item.label }}
                          </option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.provinsi }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Kabupaten</label
                        >

                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetailTemp.kabupaten"
                          @change="getKecamatan($event)"
                        >
                          <!-- <option disabled selected>Pilih Kabupaten</option> -->
                          <option selected>
                            {{ getSekolah.kabupaten }}
                          </option>
                          <option
                            v-for="item in listKabupaten"
                            :key="item.code"
                            :value="item.code"
                          >
                            {{ item.label }}
                          </option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kabupaten }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="name"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Kecamatan</label
                        >

                        <select
                          class="select select-bordered w-full max-w-xs"
                          v-model="dataDetailTemp.kecamatan"
                          @change="setKecamatan($event)"
                        >
                          <!-- <option disabled selected>Pilih Kecamatan</option> -->
                          <option selected>
                            {{ getSekolah.kecamatan }}
                          </option>
                          <option
                            v-for="item in listKecamatan"
                            :key="item.code"
                            :value="item.code"
                          >
                            {{ item.label }}
                          </option>
                        </select>
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.kecamatan }}
                        </div>
                      </div>
                    </div>

                    <div class="w-full flex justify-end mt-4 px-20">
                      <button class="btn btn-lg btn-primary">Simpan</button>
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

  <div class="px-4 py-0">
    <div class="w-full">
      <div class="bg-base-100 shadow rounded-lg px-0 py-0">
        <div class="w-full lg:w-fi mx-0">
          <div class="p-2 sm:p-6 xl:p-8">
            <Form v-slot="{ errors }" @submit="onSubmitForm2" v-if="data">
              <div class="pt-0 px-0">
                <div class="w-full mx-0">
                  <div class="rounded-lg p-0 sm:p-6 xl:p-0">
                    <div class="grid md:grid-cols-2 gap-2">
                      <div>
                        <label
                          for="password"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Password</label
                        >
                        <Field
                          v-model="dataForm2.password"
                          :rules="validateDataForm2"
                          type="password"
                          name="password"
                          ref="password"
                          class="input input-bordered md:w-full max-w-2xl"
                          @keyup="periksaPassword()"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.password }}
                        </div>
                      </div>
                      <div>
                        <label
                          for="password2"
                          class="text-sm font-medium text-base-content block mb-2"
                          >Konfirmasi Password</label
                        >
                        <Field
                          v-model="dataForm2.password_confirmation"
                          :rules="validateDataForm2"
                          type="password"
                          name="password_confirmation"
                          ref="password_confirmation"
                          @keyup="periksaPassword()"
                          class="input input-bordered md:w-full max-w-2xl"
                          required
                        />
                        <div class="text-xs text-red-600 mt-1">
                          {{ errors.password_confirmation }}
                        </div>
                      </div>
                    </div>

                    <div class="w-full flex justify-end mt-4 px-20">
                      <button
                        class="btn btn-lg btn-primary"
                        v-if="isPasswordSama"
                      >
                        Simpan
                      </button>
                      <span
                        class="btn btn-lg btn-dark"
                        v-else
                        @click="doAlertPasswordTidakSama()"
                      >
                        Simpan
                      </span>
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
