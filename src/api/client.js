import axios from 'axios';
import toast from 'react-hot-toast';
import { USE_MOCK } from './config';

const TOKEN_KEY = 'zyro_auth_token';
const USER_KEY = 'zyro_user';

export const unwrap = (response) => response?.data?.data ?? response?.data;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (USE_MOCK) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.response?.data?.error;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        window.location.assign('/login');
      }
    } else if (status === 403) {
      toast.error(message || 'You do not have permission for this action.');
    } else if (message) {
      toast.error(message);
    } else if (!error?.response) {
      toast.error('Unable to reach Zyro services.');
    }

    return Promise.reject(error);
  }
);

export { TOKEN_KEY, USER_KEY };
