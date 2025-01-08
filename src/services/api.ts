import axios from 'axios';


// const BASE_URL = "http://104.248.234.39:8080/";
const BASE_URL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
        console.error('Unauthorized');
        localStorage.removeItem('access_token');
        window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;


export const getUserStats = async () => {
  const response = await api.get('users/stats');
  return response.data;
};