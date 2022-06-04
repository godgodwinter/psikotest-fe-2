<script setup>
import NavBar from "@/components/template/NavBar.vue";
import SideBar from "@/components/template/SideBar.vue";
</script>
<template>
  <!-- <div class="font-serif">
    <AdminHeader />
  </div> -->
  <div class="font-serif">
    <NavBar />
    <SideBar />

    <div class="flex overflow-hidden bg-white pt-24 px-2">
      <div
        class="bg-white opacity-50 hidden fixed inset-0 z-10"
        id="sidebarBackdrop"
      />
      <div
        id="main-content"
        class="w-full bg-gray-50 relative lg:ml-72 h-min-screen"
      >
        <main>
          <router-view />
          <Footer />
        </main>
      </div>
    </div>
  </div>
  -
  <!-- <main class="container mx-w-6xl mx-auto font-serif">
    <router-view />
  </main> -->
</template>
