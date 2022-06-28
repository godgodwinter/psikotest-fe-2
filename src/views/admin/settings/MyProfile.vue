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
storeAdminBar.setPagesActive("profile");

const getPaket = computed(() => storeGuruBk.getPaket);
const getStats = computed(() => storeGuruBk.getStats);
const getIdentitas = computed(() => storeGuruBk.getIdentitas);
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
// Validasi Submit Photo
const fnValidateFile = (file) => {
  if (file) {
    if (file.size > 1048576) {
      Toast.danger("Warning", "File harus kurang dari 1mb!");
      return false;
    }
    if (file.type != "image/jpeg" && file.type != "image/png") {
      Toast.danger("Warning", "File harus jpg/png!");
      return false;
    }

    return true;
  } else {
    Toast.danger("Info", "Pilih File terlebih dahulu!");
    return false;
  }
};

const fnDoUploadFile = async (file, jenis) => {
  let link = "";
  if (jenis == "logosekolah") {
    link = `gurubk/myprofile/upload/logosekolah`;
  } else if (jenis == "kepalasekolah") {
    link = `gurubk/myprofile/upload/kepalasekolah`;
  } else {
    link = `gurubk/myprofile/upload/gurubk`;
  }

  let formData = new FormData();
  formData.append("file", file);
  //   formData.append("file", file.value.files[0]);
  //   let dataStore = {
  //     file: file,
  //   };
  try {
    // const response = await Api.post(link, dataStore);

    const response = await Api.post(link, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    Toast.success("Success", "Data Berhasil update!");
    // router.go();
    // resetForm();
    console.log(response);
    return response.data;
  } catch (error) {
    Toast.danger("Warning", "Data gagal ditambahkan!");
    console.error(error);
  }
};

const photoLogoSekolah = ref(null);
const photoLogoSekolahFile = ref(null);
const doUploadLogoSekolah = () => {
  if (fnValidateFile(photoLogoSekolahFile.value)) {
    fnDoUploadFile(photoLogoSekolahFile.value, "logosekolah");
    // Toast.babeng("Info", "Fitur belum tersedia!");
  }
};
const onChangePhotoLogoSekolah = (e) => {
  let file = e.target.files[0];
  photoLogoSekolahFile.value = file;
  photoLogoSekolah.value = URL.createObjectURL(file);
  console.log(file, photoLogoSekolah.value);
};

const photoKepalaSekolah = ref(null);
const photoKepalaSekolahFile = ref(null);
const doUploadPhotoKepalaSekolah = () => {
  if (fnValidateFile(photoKepalaSekolahFile.value)) {
    fnDoUploadFile(photoKepalaSekolahFile.value, "kepalasekolah");
    // Toast.babeng("Info", "Fitur belum tersedia!");
  }
};
const onChangePhotoKepalaSekolah = (e) => {
  let file = e.target.files[0];
  photoKepalaSekolahFile.value = file;
  photoKepalaSekolah.value = URL.createObjectURL(file);
  console.log(file, photoKepalaSekolah.value);
};

const photoUser = ref(null);
const photoUserFile = ref(null);
const doUploadUser = () => {
  if (fnValidateFile(photoUserFile.value)) {
    fnDoUploadFile(photoUserFile.value, "gurubk");
    // Toast.babeng("Info", "Fitur belum tersedia!");
  }
};
const onChangePhotoUser = (e) => {
  let file = e.target.files[0];
  photoUserFile.value = file;
  photoUser.value = URL.createObjectURL(file);
  console.log(file, photoUser.value);
};

const getDataPhoto = async () => {
  try {
    const response = await Api.get(`gurubk/myprofile/upload/getphoto`);
    // console.log(response.data);

    photoLogoSekolah.value = response.data.logosekolah;
    photoKepalaSekolah.value = response.data.kepalasekolah;
    photoUser.value = response.data.user;
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

getDataPhoto();
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

  <div class="px-4 pt-10">
    <h3 class="font-bold">UPDATE DATA SEKOLAH</h3>
  </div>
  <div class="px-4 py-0">
    <div class="w-full">
      <div class="bg-base-100 shadow-lg rounded-lg px-0 py-0">
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
                        <select class="select select-bordered w-full" disabled>
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
                          class="select select-bordered w-full"
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
                          class="select select-bordered w-full"
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
                          class="select select-bordered w-full"
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

  <div class="px-4 py-10">
    <h3 class="font-bold">UPDATE PASSWORD</h3>
  </div>
  <div class="px-4 py-0 shadow-lg">
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

                    <div class="w-full flex justify-end mt-4 px-20 gap-4">
                      <div
                        class="collapse collapse-arrow shadow-sm border border-spacing-1"
                      >
                        <input type="checkbox" />
                        <div class="collapse-title text-md font-bold">
                          Catatan :
                        </div>
                        <div class="collapse-content text-sm">
                          <p># Minimal 3 Karakter</p>
                        </div>
                      </div>
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

  <div class="px-4 py-4">
    <h3 class="font-bold">UPDATE PHOTO</h3>
  </div>
  <div class="w-full flex justify-center flex-wrap">
    <div
      class="xl:flex felx-wrap gap-10 xl:w-full px-4 justify-center space-y-4"
    >
      <div class="card xl:w-2/5 bg-base-100 shadow-xl">
        <div class="w-full flex justify-center">
          <label
            class="avatar hover:scale-110 transition-all duration-500"
            for="my-modal-1"
          >
            <div class="w-52 mask mask-squircle">
              <img v-if="photoLogoSekolah" :src="photoLogoSekolah" />
              <img v-else src="@/assets/img/logo/github-copilot.svg" />
            </div>
          </label>
        </div>

        <!-- modal -->
        <input type="checkbox" id="my-modal-1" class="modal-toggle" />
        <label for="my-modal-1" class="modal cursor-pointer">
          <label class="modal-box relative" for="">
            <img v-if="photoLogoSekolah" :src="photoLogoSekolah" />
            <img v-else src="@/assets/img/logo/github-copilot.svg" />
          </label>
        </label>

        <!-- modal -->

        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ getSekolah.nama }}</h2>
          <p>SEKOLAH</p>
          <div class="card-actions">
            <!-- <button class="btn btn-primary">Update Logo Sekolah</button> -->
          </div>
        </div>
        <div class="px-10 pt-2">
          <p class="text-sm font-bold">Pilih Logo Sekolah :</p>
          <input
            type="file"
            name="photoLogoSekolah"
            @change="onChangePhotoLogoSekolah($event)"
            class="input md:w-full max-w-2xl"
            required
          />
        </div>
        <div class="flex justify-end px-10 pb-4">
          <button class="btn btn-lg btn-primary" @click="doUploadLogoSekolah()">
            UPLOAD
          </button>
        </div>
      </div>

      <div class="card xl:w-2/5 bg-base-100 shadow-xl">
        <div class="w-full flex justify-center">
          <label
            class="avatar hover:scale-110 transition-all duration-500"
            for="my-modal-2"
          >
            <div class="w-52 mask mask-squircle">
              <img v-if="photoKepalaSekolah" :src="photoKepalaSekolah" />
              <img v-else src="@/assets/img/avatar/user.png" />
            </div>
          </label>

          <!-- modal -->
          <input type="checkbox" id="my-modal-2" class="modal-toggle" />
          <label for="my-modal-2" class="modal cursor-pointer">
            <label class="modal-box relative" for="">
              <img v-if="photoKepalaSekolah" :src="photoKepalaSekolah" />
              <img v-else src="@/assets/img/avatar/user.png" />
            </label>
          </label>

          <!-- modal -->
        </div>
        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ getSekolah.kepsek_nama }}</h2>
          <p>KEPALA SEKOLAH</p>
          <div class="card-actions">
            <!-- <button class="btn btn-primary">Update Photo Kepala Sekolah</button> -->
          </div>
        </div>
        <div class="px-10 pt-2">
          <p class="text-sm font-bold">Pilih Photo Kepala Sekolah :</p>
          <input
            type="file"
            name="photoKepalaSekolah"
            @change="onChangePhotoKepalaSekolah($event)"
            class="input md:w-full max-w-2xl"
            required
          />
        </div>
        <div class="flex justify-end px-10 pb-4">
          <button
            class="btn btn-lg btn-primary"
            @click="doUploadPhotoKepalaSekolah()"
          >
            UPLOAD
          </button>
        </div>
      </div>

      <div class="card xl:w-2/5 bg-base-100 shadow-xl">
        <div class="w-full flex justify-center">
          <label
            class="avatar hover:scale-110 transition-all duration-500"
            for="my-modal-3"
          >
            <div class="w-52 mask mask-squircle">
              <img v-if="photoUser" :src="photoUser" />
              <img v-else src="@/assets/img/avatar/user.png" />
            </div>
          </label>
        </div>

        <!-- modal -->
        <input type="checkbox" id="my-modal-3" class="modal-toggle" />
        <label for="my-modal-3" class="modal cursor-pointer">
          <label class="modal-box relative" for="">
            <img v-if="photoUser" :src="photoUser" />
            <img v-else src="@/assets/img/avatar/user.png" />
          </label>
        </label>

        <!-- modal -->
        <div class="card-body items-center text-center">
          <h2 class="card-title">{{ getIdentitas.nama }}</h2>
          <p>USER</p>
          <div class="card-actions">
            <!-- <button class="btn btn-primary">Update Photo Kepala Sekolah</button> -->
          </div>
        </div>
        <div class="px-10 pt-2">
          <p class="text-sm font-bold">Pilih Photo User :</p>
          <input
            type="file"
            name="photoUser"
            @change="onChangePhotoUser($event)"
            class="input md:w-full max-w-2xl"
            required
          />
        </div>
        <div class="flex justify-end px-10 pb-4">
          <button class="btn btn-lg btn-primary" @click="doUploadUser()">
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="collapse collapse-arrow shadow-sm border border-spacing-1">
    <input type="checkbox" />
    <div class="collapse-title text-md font-bold">Catatan Upload PHOTO:</div>
    <div class="collapse-content text-sm">
      <p># Extensi : .jpg / .png</p>
      <p># Max Size : 1 MB<br /></p>
    </div>
  </div>
</template>
