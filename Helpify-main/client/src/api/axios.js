import axios from 'axios';
import { getUser, setUser } from '../utills/user';
import { refreshTokenAPI } from './auth';

// Get the base URL from environment variables or use the default
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Create an instance of axios with the base URL
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the auth token in the axios instance headers
export const setAuthToken = (token) => {
  if (token) {
    // Ensure token is a string
    const tokenString = typeof token === 'string' ? token : token.token;
    // Apply the token to all requests
    instance.defaults.headers.common['Authorization'] = `Bearer ${tokenString}`;
    // Also set in localStorage for persistence
    localStorage.setItem('authToken', tokenString);
    console.log('Auth token set:', tokenString);
  } else {
    // Remove the token if it's not provided
    delete instance.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
    console.log('Auth token removed');
  }
};

// Add a request interceptor to automatically add the token from localStorage
instance.interceptors.request.use(
  (config) => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('authToken');
    console.log(
      'Checking for token in localStorage:',
      token ? 'Found' : 'Not found'
    );

    // If no direct token, try to get it from user data
    if (!token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.token?.token) {
            const userToken = user.token.token;
            localStorage.setItem('authToken', userToken);
            config.headers['Authorization'] = `Bearer ${userToken}`;
            console.log('Using token from user data');
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Using token from localStorage');
    }

    // Fix URL formatting for endpoints
    if (config.url) {
      // Remove any leading slashes and normalize path separators
      const normalizedPath = config.url
        .replace(/^\/+/, '')
        .replace(/\/+/g, '/');
      // Remove any duplicate api/v1 in the path
      const cleanPath = normalizedPath.replace(/api\/v1\//g, '');
      config.url = cleanPath;
      console.log('Normalized URL:', config.url);
      console.log('Making request to:', `${config.baseURL}/${config.url}`);
    }

    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = getUser();
        if (!user || !user.token) {
          console.log('No user data or token found');
          localStorage.clear();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Get refresh token from user object
        const refreshToken = user.token.refreshToken;
        if (!refreshToken) {
          console.log('No refresh token found');
          localStorage.clear();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await refreshTokenAPI(refreshToken);
        if (response && response.token) {
          // Update the token in localStorage and axios instance
          setAuthToken(response.token);
          // Update user data with new tokens
          const updatedUser = {
            ...user,
            token: {
              token: response.token,
              refreshToken: response.refreshToken,
            },
          };
          setUser(updatedUser);
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.token}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // If refresh fails, clear user data and redirect to login
        localStorage.clear();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
