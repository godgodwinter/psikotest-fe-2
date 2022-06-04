<script setup>
import { computed } from "vue";
import { useStoreAuth } from "@/stores/auth";
import Api from "@/axios/axios";
import jwt_decode from "jwt-decode";
import Toast from "@/components/lib/Toast.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const storeAuth = useStoreAuth();
const router = useRouter();
const email = ref();
const password = ref();

const doLogin = async (username, password) => {
  try {
    const response = await Api.post("gurubk/auth/login", {
      email: username,
      password,
    });
    // console.log(response);
    if (response.code === 200) {
      const { token } = response;
      localStorage.setItem("token", token);
      localStorage.setItem("isLogin", true);
      console.log("Login berhasil");
      storeAuth.setIsLogin(true);
      storeAuth.setToken(token);
      router.push({ name: "AdminDashboard" });
      let decoded = jwt_decode(token);
      // store.commit("setDataAuth", decoded);
      // console.log(decoded);
      Toast.success("Success", "Login Berhasil!");
    } else {
      Toast.danger("Warning", "Login gagal!");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    Toast.danger("Warning", "Login gagal!");
  }
};
const onSubmit = () => {
  doLogin(email.value, password.value);
};
</script>
<template>
  <!-- <div class="bg-white flex flex-col justify-center sm:py-32">
    <div class="relative py-0 sm:max-w-xl sm:mx-auto">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-2 sm:skew-y-0 sm:-rotate-2 sm:rounded-3xl"
      ></div>
      <div
        class="relative px-4 py-10 bg-white border border-sky-800 hover:shadow-2xl sm:rounded-3xl sm:p-10"
      >
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div
              class="flex flex-col bg-white shadow-sm px-10 py-4 rounded-3xl w-50"
            >
              <div
                class="font-bold self-center text-xl sm:text-3xl text-gray-800"
              >
                LOGIN
              </div>
              <div
                class="mt-4 self-center text-xl sm:text-sm text-gray-800 text-center"
              >
                Masuk sebagai Administrator
              </div>

              <div>
                <div class="mt-10">
                  <div class="flex flex-col mb-5">
                    <label
                      for="email"
                      class="mb-1 text-xs tracking-wide text-gray-600"
                      >Username or Email:</label
                    >
                    <div class="relative">
                      <div
                        class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
                      >
                        <i class="fas fa-at text-blue-500"></i>
                      </div>

                      <input
                        v-model="email"
                        name="username"
                        type="email"
                        class="w-full border-gray-300 border px-4 py-2 rounded focus:border focus:border-blue-500 focus:shadow-outline outline-none"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col mb-6">
                    <label
                      for="password"
                      class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                      >Password:</label
                    >
                    <div class="relative">
                      <div
                        class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400"
                      >
                        <span>
                          <i class="fas fa-lock text-blue-500"></i>
                        </span>
                      </div>

                      <input
                        v-model="password"
                        name="password"
                        type="password"
                        class="w-full border-gray-300 border px-4 py-2 rounded focus:border focus:border-blue-500 focus:shadow-outline outline-none"
                      />
                    </div>
                  </div>
                  <button class="flex w-full" @click="onSubmit()">
                    <span
                      href="#"
                      type="submit"
                      class="flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
                    >
                      <span class="mr-2 uppercase">Sign In</span>
                      <span>
                        <svg
                          class="h-6 w-6"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <div class="">
    <div class="hero bg-base-100 py-32">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">Menu Sekolah</h1>
          <p class="py-6">Masuk sebagai Admin Sekolah.</p>
        </div>
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email / Username</span>
              </label>
              <input
                v-model="email"
                name="username"
                type="text"
                placeholder="email"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="password"
                name="password"
                type="password"
                placeholder="password"
                class="input input-bordered"
              />
              <!-- <label class="label">
                <a href="#" class="label-text-alt link link-hover"
                  >Forgot password?</a
                >
              </label> -->
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary" @click="onSubmit()">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
