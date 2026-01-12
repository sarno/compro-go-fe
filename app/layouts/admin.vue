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
  <div class="dark:bg-gray-800 dark:text-gray-300">
    <NavbarAdmin />
    <SidebarAdmin />

    <div class="p-4 sm:ml-64 dark:bg-gray-800">
      <div
        class="h-full p-4 bg-white dark:bg-gray-800 dark:border-gray-700 mt-14"
      >
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
