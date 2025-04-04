import axiosInstance from './axios';
import { BASE_URL } from '../constants';

export const me = (token) => {
  return axiosInstance
    .get('auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const login = (body) => {
  return axiosInstance.post('auth/login', body).then((res) => res.data);
};

export const register = (body) => {
  return axiosInstance.post('auth/register', body).then((res) => res.data);
};

export const updateProfile = (body) => {
  return axiosInstance.put('auth/me', body).then((res) => res.data);
};

export const refreshTokenAPI = (refreshToken) => {
  return axiosInstance
    .post(
      'auth/refresh-token',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          RefreshToken: refreshToken,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error refreshing token:', error);
      throw error;
    });
};

export const getUserById = (id) => {
  return axiosInstance.get(`auth/get-user-by-id/${id}`).then((res) => res.data);
};

export const changePassword = (body) => {
  return axiosInstance.put('auth/me/password', body).then((res) => res.data);
};

export const getProfile = (username) => {
  return axiosInstance.get(`auth/profile/${username}`).then((res) => res.data);
};

export const forgetPassword = (body) => {
  return axiosInstance
    .post('auth/forget-password', body)
    .then((res) => res.data);
};

export const resetPassword = (body) => {
  return axiosInstance
    .post('auth/reset-password', body)
    .then((res) => res.data);
};
