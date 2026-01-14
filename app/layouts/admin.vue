<script setup lang="ts">
import { initFlowbite } from "flowbite";
import NavbarAdmin from "~/components/admin/NavbarAdmin.vue";
import SidebarAdmin from "~/components/admin/SidebarAdmin.vue";

const authStore = useAuthStore();
authStore.checkAuth();

onMounted(() => {
  initFlowbite();
});
</script>

<template>
  <div class="bg-gray-100 text-gray-800">
    <NavbarAdmin />
    <SidebarAdmin />

    <div class="p-4 sm:ml-64 bg-gray-100">
      <div
        class="h-full p-4 bg-white border-gray-200 mt-14"
      >
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
