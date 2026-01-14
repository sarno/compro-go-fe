<script setup>
import auth from "~/stores/middleware/auth";
import { ref } from "vue";
import { createData, uploadImage } from "~/utils/api";

definePageMeta({
  layout: "admin",
  title: "Admin Area | Create Hero Section",
  middleware: [auth],
});

const heading = ref("");
const sub_heading = ref("");
const file = ref(null);
const fileName = ref("");
const imageUrl = ref("");
const path_video = ref("");
const heroError = ref("");

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    fileName.value = selectedFile.name;
    imageUrl.value = URL.createObjectURL(selectedFile);
  }
};

const handlerSubmit = async () => {
  try {
    const respImage = await uploadImage("/upload-image", file.value);

    const requestData = {
      heading: heading.value,
      subheading: sub_heading.value,
      banner: respImage.data.url,
      path_video: path_video.value,
    };

    await createData("/hero-sections/admin", requestData);
    const successMessage = "Data berhasil dibuat!";
    sessionStorage.setItem("successMessage", successMessage);
    navigateTo("/dashboard/hero");
  } catch (error) {
    console.error("Error", error);
    heroError.value = error.message;
  }
};
</script>

<template>
  <div>
    <NuxtLink
      to="/dashboard/hero"
      class="flex items-center text-gray-900 hover:text-blue-800"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
      Back
    </NuxtLink>
    <div class="flex flex-row items-center justify-between">
      <div class="my-5 text-2xl font-bold">Tambah Hero</div>
    </div>
    <form @submit.prevent="handlerSubmit" method="post">
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            for="heading"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Heading</label
          >
          <input
            type="text"
            v-model="heading"
            id="heading"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Build Company"
            required
          />
        </div>
        <div>
          <label
            for="sub_heading"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Sub Heading</label
          >
          <input
            type="text"
            v-model="sub_heading"
            id="sub_heading"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="company"
            required
          />
        </div>
        <div>
          <label
            for="banner"
            class="block mb-2 text-sm font-medium text-gray-900"
            >Banner</label
          >
          <input
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1.5"
            id="banner"
            type="file"
            accept="image/*"
          />
          <p v-if="fileName">File yang dipilih: {{ fileName }}</p>
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="w-20 h-20"
            alt="Preview"
          />
        </div>
        <div>
          <label
            for="path_video"
            class="block mb-2 text-sm font-medium text-gray-900"
            >URL Video</label
          >
          <input
            v-model="path_video"
            type="text"
            id="path_video"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="https://youtube.com"
          />
        </div>
        <p v-if="heroError" class="text-sm text-red-600">{{ heroError }}</p>
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
