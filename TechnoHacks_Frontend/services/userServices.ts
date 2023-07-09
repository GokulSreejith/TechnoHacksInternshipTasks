import ApiEndpoints from '@/core/apiEndpoints';
import httpClient from '@/core/axios';
import { LocalStorageKeys } from '@/core/localStorageKeys';
import { IUser } from '@/interfaces/userInterfaces';

/**
 * To register a user
 * @param data
 * @returns message, data
 */
export const doRegisterService = (data: IUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, username, phone, password } = data;

    if (!name || !username || !email || !password) {
      throw new Error('Provide name, username, email and password');
    }

    try {
      const resp = (
        await httpClient().post(ApiEndpoints.register, {
          name,
          email,
          username,
          phone,
          password,
        })
      ).data;
      localStorage.setItem(LocalStorageKeys.adminToken, resp.results.token);
      resolve({
        message: 'Registered successfully',
        data: resp.results,
      });
    } catch (error: any) {
      reject({
        message:
          error?.response?.data?.message ||
          error.message ||
          'Registration failed',
      });
    }
  });
};

/**
 * To login a user
 * @param data
 * @returns message, data
 */
export const doLoginService = (username: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!username || !password) {
        throw new Error('Provide username and password');
      }

      const resp = (
        await httpClient().patch(ApiEndpoints.login, {
          username,
          password,
        })
      ).data;
      localStorage.setItem(LocalStorageKeys.adminToken, resp.results.token);
      resolve({
        message: 'Login successfully',
        data: resp.results,
      });
    } catch (error: any) {
      reject({
        message:
          error?.response?.data?.message ||
          error.message ||
          'Registration failed',
      });
    }
  });
};

/**
 * To get a profile for logged in user
 * @returns message, data
 */
export const getProfile = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userToken = localStorage.getItem(LocalStorageKeys.adminToken);

      if (!userToken) {
        throw new Error('Please login');
      }

      // Profile API fetch
      const resp = (await httpClient().get(ApiEndpoints.profile)).data;

      resolve({
        message: 'Profile fetched successfully',
        data: resp.results,
      });
    } catch (error: any) {
      reject({
        message:
          error?.response?.data?.message ||
          error.message ||
          'Registration failed',
      });
    }
  });
};

export const doLogoutService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userToken = localStorage.getItem(LocalStorageKeys.adminToken);

      if (!userToken) {
        resolve({
          message: 'Pleae login',
        });
      }

      localStorage.removeItem(LocalStorageKeys.adminToken);

      resolve({
        message: 'Logout successfull',
      });
    } catch (error: any) {
      reject({
        message: error.message || 'Registration failed',
      });
    }
  });
};
