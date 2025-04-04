export const role = {
  ADMIN: 1,
  PROVIDER: 2, // Service providers
  CUSTOMER: 3, // People booking services
};

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
