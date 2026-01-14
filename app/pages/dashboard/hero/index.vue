<script setup>
import { ref, onMounted } from "vue";
import auth from "~/stores/middleware/auth";
import { fetchData, deleteData } from "~/utils/api";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "admin",
  title: "Admin Area | Hero Section",
  middleware: [auth],
});

const authStore = useAuthStore();
const isAuthenticated = authStore.isAuthenticated;
const data = ref([]);
const loading = ref(false);
const showToast = ref(false);
const route = useRoute();
const itemToDelete = ref(null);
let successMessage = ref(null);

onMounted(() => {
  if (route.query.success) {
    showToast.value = true;
  }

  if (isAuthenticated) {
    loadData();
  }

  const message = sessionStorage.getItem("successMessage");
  if (message) {
    successMessage.value = message;
    setTimeout(() => {
      successMessage.value = null;
      sessionStorage.removeItem("successMessage");
    }, 5000);
  }
});

const loadData = async () => {
  if (!isAuthenticated) {
    return;
  }

  loading.value = true;
  try {
    data.value = await fetchData("/hero-sections/admin");
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (id) => {
  itemToDelete.value = id;
  const modal = document.getElementById("popup-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }
};

const closeDeleteModal = () => {
  const modal = document.getElementById("popup-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

const deleteHero = async () => {
  // Proses penghapusan data berdasarkan itemToDelete
  const id = itemToDelete.value;
  if (id) {
    try {
      await deleteData("/hero-sections/admin", id);
      successMessage = "Data berhasil dihapus!";
      sessionStorage.setItem("successMessage", successMessage);
      await loadData();
      closeDeleteModal();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  }
};
</script>

<template>
  <div
    v-if="successMessage"
    id="toast-success"
    class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        />
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ successMessage }}</div>
    <button
      @click="closeToast"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      data-dismiss-target="#toast-success"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>

  <div class="flex flex-row items-center justify-between">
    <div class="my-5 text-2xl font-bold">List Data Hero</div>
    <NuxtLink
      to="/dashboard/hero/create"
      class="mr-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >Tambah Data</NuxtLink
    >
    <div v-if="loading">Loading...</div>
  </div>

  <div class="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
    <table
      v-if="data.data && data.data.length"
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs border-b text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Heading</th>
          <th scope="col" class="px-6 py-3">Sub Heading</th>
          <th scope="col" class="px-6 py-3">Banner</th>
          <th scope="col" class="px-6 py-3">Video</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data.data"
          :key="item.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ item.heading }}
          </th>
          <td class="px-6 py-4">
            {{ item.subheading }}
          </td>
          <td class="px-6 py-4">
            <img :src="item.banner" class="w-10 h-10" alt="" />
          </td>
          <td class="px-6 py-4">
            {{ item.path_video }}
          </td>
          <td class="flex items-center px-6 py-4">
            <NuxtLink
              :to="`/dashboard/hero/edit/${item.id}`"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</NuxtLink
            >
            <button
              @click="openDeleteModal(item.id)"
              class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      id="popup-modal"
      tabindex="-1"
      class="hidden fixed overflow-y-auto overflow-x-hidden fix top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div
        class="relative p-4 w-full left-1/3 top-1/4 right-2/3 max-w-md max-h-full"
      >
        <div class="relative bg-amber-200 rounded-lg shadow dark:bg-gray-700">
          <button
            @click="closeDeleteModal"
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg
              class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3
              class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
            >
              Are you sure you want to delete this product?
            </h3>
            <button
              @click="deleteHero"
              type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Yes, I'm sure
            </button>
            <button
              @click="closeDeleteModal"
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
