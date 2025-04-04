import axios from 'axios';
import { BASE_URL } from '../constants';

const getServicesByCategory = async (category) => {
  try {
    console.log('Fetching services for category:', category);
    const response = await axios.get(`/service?category=${category}`);
    console.log('Service API response:', response.data);

    if (response.data && response.data.success) {
      return response.data.services;
    } else {
      console.error('Invalid response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching services:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

export default getServicesByCategory;
