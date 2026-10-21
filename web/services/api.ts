import axios from 'axios';

const api = axios.create({
  baseURL: 'https://csr-lwbu.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Agar user logged in hai toh uska security token har API call mein bhejna
api.interceptors.request.use(
  (config) => {
    // Browser ki local storage se token nikalna
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;