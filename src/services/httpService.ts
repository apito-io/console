import axios from 'axios';
import { message } from 'antd';
import { ENV } from '../utils/env';

const httpService = axios.create({
  withCredentials: true,
  baseURL: ENV.VITE_REST_API,
  headers: {
    'X-Use-Cookies': 'true',
  },
});

// Delete all cookies utility function
const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  }
};

httpService.interceptors.response.use(
  (res) => res,
  (err) => {
    const currentPath = window.location.pathname;

    if (err?.response?.status === 400) {
      message.error(err.message);
    } else if (err?.response?.status === 401 || err?.response?.status === 403) {
      // Only redirect to login if we're not in the middle of project switching
      // or if the current path is not already a console route
      if (!currentPath.startsWith('/console/') && !err.config?.url?.includes('project/switch')) {
        deleteAllCookies();
        window.location.href = '/login';
      } else {
        // For console routes or project switching, just pass the error through
        // without redirecting, let the component handle it
        console.warn('Authentication error in console context:', err);
      }
    } else if (err?.response?.status === 409) {
      deleteAllCookies();
      window.location.href =
        '/login?message=Another person used your credential to login. Please use your own account to login.';
    } else if (err?.response?.status === 500) {
      message.error(err?.response?.data?.message);
    }
    return Promise.reject(err);
  }
);

export { httpService, deleteAllCookies }; 