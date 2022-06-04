<script setup>
import NavBar from "@/components/template/NavBar.vue";
import SideBar from "@/components/template/SideBar.vue";
import Footer from "@/components/template/Footer.vue";
</script>
<template>
  <!-- <div class="font-serif">
    <AdminHeader />
  </div> -->
  <div class="font-serif">
    <NavBar />
    <SideBar />

    <div class="flex overflow-hidden pt-24 px-2 bg-base-100">
      <div class="opacity-50 hidden fixed inset-0 z-10" />
      <div class="w-full relative lg:ml-72">
        <main class="pb-4 min-h-screen">
          <router-view />
        </main>
        <Footer />
      </div>
    </div>
  </div>
  -
  <!-- <main class="container mx-w-6xl mx-auto font-serif">
    <router-view />
  </main> -->
</template>
