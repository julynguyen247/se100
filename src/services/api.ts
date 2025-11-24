import axios from "@/services/api.customize";
export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 1000,
      },
    }
  );
};
export const registerAPI = (
  email: string,
  password: string,
  fullName: string
) => {
  const urlBackend = "/api/v1/users";
  return axios.post(urlBackend, {
    email,
    password,
    fullName,
  });
};
export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get(urlBackend);
};
export const getAllUsersAPI = (query: string) => {
  const urlBackend = `/api/v1/users?${query}`;
  return axios.get(urlBackend);
};

export const createUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/users";
  return axios.post(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = `/api/v1/users/${_id}`;
  return axios.patch(urlBackend, {
    _id,
    fullName,
    phone,
  });
};
export const getShoesAPI = (query: string) => {
  const urlBackend = `/api/v1/shoes?${query}`;
  return axios.get(urlBackend);
};
export const createShoesAPI = (
  mainText: string,
  brand: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = "/api/v1/shoes";
  return axios.post(urlBackend, {
    mainText,
    brand,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};
export const updateShoesAPI = (
  _id: string,
  mainText: string,
  brand: string,
  price: number,
  quantity: number
) => {
  const urlBackend = `/api/v1/shoes/${_id}`;
  return axios.patch(urlBackend, {
    _id,
    mainText,
    brand,
    price,
    quantity,
  });
};
export const deleteUserAPI = (_id: string) => {
  const urlBackend = `/api/v1/users/${_id}`;
  return axios.delete(urlBackend);
};
export const deleteShoesAPI = (_id: string) => {
  const urlBackend = `/api/v1/shoes/${_id}`;
  return axios.delete(urlBackend);
};
export const logoutAPI = () => {
  const urlBackend = `/api/v1/logout`;
  return axios.post(urlBackend);
};
export const uploadFileAPI = (file: any, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios<IBackendRes<{ fileName: string }>>({
    method: "post",
    url: "/api/v1/files/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      folder_type: folder,
    },
  });
};
export const getCategories = () => {
  const urlBackend = `/api/v1/shoes/categories`;
  return axios.get(urlBackend);
};
export const getBrands = () => {
  const urlBackend = `/api/v1/shoes/brands`;
  return axios.get(urlBackend);
};
