import axiosInstance from './axios';

export const fetchActiveOrders = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch orders');
    }

    const response = await axiosInstance.get(`/bids/provider/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (response.data.success) {
      return response.data.bids || [];
    }

    throw new Error(response.data.message || 'Failed to fetch orders');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchBidHistory = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/bids/provider/${userId}/counter-offers`
    );

    if (response.data.success) {
      return response.data.bids || [];
    }

    throw new Error(response.data.message || 'Failed to fetch bid history');
  } catch (error) {
    console.error('Error fetching bid history:', error);
    throw error;
  }
};
