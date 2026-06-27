import axios from 'axios';
import axiosRetry from 'axios-retry';
import { STORAGE_KEYS } from '@/constants/routes';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    if (!navigator.onLine) return false;
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response?.status ?? 0) >= 500
    );
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      const path = window.location.pathname;
      if (
        !path.startsWith('/login') &&
        path !== '/' &&
        path !== '/solicitud' &&
        path !== '/bootstrap-admin'
      ) {
        window.location.href = '/login/operativo';
      }
    }
    return Promise.reject(error);
  },
);
