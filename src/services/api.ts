import axios from "@/services/api.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
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
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    email,
    password,
    fullName,
  });
};
export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

export const createAppointmentAPI = (
  fullName: string,
  phone: string,
  email: string,
  date: string,
  time: string,
  service: string,
  doctor: string,
  note?: string
) => {
  const urlBackend = "/api/appointments";

  return axios.post(urlBackend, {
    fullName,
    phone,
    email,
    date,
    time,
    service,
    doctor,
    note,
  });
};
export const getServicesAPI = () => {
  const urlBackend = "/api/services";
  return axios.get(urlBackend);
};
export const getDoctorsAPI = () => {
  const urlBackend = "/api/doctors";
  return axios.get(urlBackend);
};
export const getTimeSlotsAPI = () => {
  const urlBackend = "/api/time-slots";
  return axios.get(urlBackend);
};
