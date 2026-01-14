import { useAuthStore } from "@/stores/auth";

const getAuthHeader = () => {
  const authStore = useAuthStore();
  const token = authStore.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchData = async (url: string, id?: number) => {
  const config = useRuntimeConfig();

  let dataId = id ?? null;
  let baseUrl = `${config.public.apiBase}${url}`;

  if (dataId !== null) {
    baseUrl += `/${id}`;
  }

  const response = await $fetch(baseUrl, getAuthHeader());
  return response;
};

export const deleteData = async (url: string, id: number) => {
  const config = useRuntimeConfig();
  const response = await $fetch(`${config.public.apiBase}${url}/${id}`, {
    method: "DELETE",
    ...getAuthHeader(),
  });

  return response;
};

export const uploadImage = async (url: string, file: File) => {
  const config = useRuntimeConfig();
  const formData = new FormData();
  formData.append("file", file);

  const response = await $fetch(`${config.public.apiBase}${url}`, {
    headers: {
      "X-Tenant-ID": "tapjwgumiitjmamrqrjc",
      ...getAuthHeader().headers,
    },
    method: "POST",
    body: formData,
  });

  return response;
};

export const createData = async (url: string, payload: any) => {
  const config = useRuntimeConfig();
  const response = await $fetch(`${config.public.apiBase}${url}`, {
    ...getAuthHeader(),
    method: "POST",
    body: payload,
  });
  return response;
};
