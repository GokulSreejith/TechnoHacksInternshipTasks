import axios from 'axios';
import ApiEndpoints from './apiEndpoints';
import { LocalStorageKeys } from './localStorageKeys';

const httpClient = (contentType?: string) => {
  // Create intance
  const instance = axios.create({
    baseURL: ApiEndpoints.baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': contentType ?? 'application/json',
    },
    validateStatus: function (status: number) {
      return status < 201;
    },
  });

  //  Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem(LocalStorageKeys.adminToken);
    config.headers!.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return instance;
};

export default httpClient;
