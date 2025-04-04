import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import ServiceProviderIcon from '../../../public/ServiceProviderIcon.png';
import { format } from 'date-fns';
import * as jwtDecode from 'jwt-decode';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const { user } = useContext(AuthContext);

  // First, get the provider ID for the logged-in user
  useEffect(() => {
    const getProviderId = async () => {
      console.log(
        'Starting getProviderId, user token:',
        user?.token?.token ? 'exists' : 'missing'
      );
      if (user?.token?.token) {
        try {
          // Get user ID from token
          const decodedToken = jwtDecode.jwtDecode(user.token.token);
          const userId = decodedToken.id;
          console.log('User ID from token:', userId);

          // Get provider information for this user
          console.log('Making API call to get provider info for user:', userId);
          const response = await axiosInstance.get(
            `/api/provider/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token.token}`,
              },
            }
          );

          console.log('Provider info response:', response.data);

          if (response.data.success) {
            setProviderId(response.data.provider.id);
            console.log('Provider ID set:', response.data.provider.id);
          } else {
            console.error('Failed to get provider info:', response.data);
            setError('Failed to get provider information');
          }
        } catch (err) {
          console.error('Error fetching provider info:', err);
          setError('Error loading provider information');
        }
      } else {
        console.log('No user token available');
      }
    };

    getProviderId();
  }, [user]);

  // Then, fetch orders once we have the provider ID
  useEffect(() => {
    const fetchOrders = async () => {
      console.log('Starting fetchOrders, providerId:', providerId);
      if (!providerId) {
        console.log('No provider ID yet, skipping order fetch');
        return;
      }

      try {
        setLoading(true);
        console.log(
          'Making API call to fetch orders for provider:',
          providerId
        );
        const response = await axiosInstance.get(
          `/api/order/provider/${providerId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token?.token}`,
            },
          }
        );

        console.log('Orders API response:', response.data);

        if (response.data.success) {
          setOrders(response.data.orders);
          console.log('Orders set:', response.data.orders);
        } else {
          console.error('Failed to fetch orders:', response.data);
          setError('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error loading orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [providerId, user]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axiosInstance.patch(
        `/order/${orderId}/status`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${user?.token?.token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the order status in the local state
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]"
        style={{ fontFamily: 'Barlow, sans-serif' }}
      >
        <div className="col-start-1 col-end-2">
          <h1 className="text-[#464255] text-[22px] sm:text-[25px] md:text-[28px] lg:text-[32px] font-semibold leading-normal">
            Order List
          </h1>
          <h2 className="text-[#A3A3A3] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-medium leading-normal">
            View and manage your orders
          </h2>
        </div>

        <div className="col-span-1 md:col-end-3 lg:col-end-5 flex justify-center gap-[8px] items-center p-3 bg-[#fff]">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34 34"
              fill="none"
              className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[34px] lg:h-[34px]"
            >
              <path
                d="M8.5 29.7502H25.5C26.6272 29.7502 27.7082 29.3024 28.5052 28.5054C29.3022 27.7083 29.75 26.6273 29.75 25.5002V8.50016C29.75 7.37299 29.3022 6.29199 28.5052 5.49496C27.7082 4.69793 26.6272 4.25016 25.5 4.25016H24.0833C24.0833 3.87444 23.9341 3.5141 23.6684 3.24843C23.4027 2.98275 23.0424 2.8335 22.6667 2.8335C22.2909 2.8335 21.9306 2.98275 21.6649 3.24843C21.3993 3.5141 21.25 3.87444 21.25 4.25016H12.75C12.75 3.87444 12.6007 3.5141 12.3351 3.24843C12.0694 2.98275 11.7091 2.8335 11.3333 2.8335C10.9576 2.8335 10.5973 2.98275 10.3316 3.24843C10.0659 3.5141 9.91667 3.87444 9.91667 4.25016H8.5C7.37283 4.25016 6.29183 4.69793 5.4948 5.49496C4.69777 6.29199 4.25 7.37299 4.25 8.50016V25.5002C4.25 26.6273 4.69777 27.7083 5.4948 28.5054C6.29183 29.3024 7.37283 29.7502 8.5 29.7502Z"
                fill="#2D9CDB"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-[#fff] p-1 sm:p-6 md:p-8 lg:p-10 space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4">No orders found</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#F3F2F7] flex gap-1 xl:gap-5 items-center p-5 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <div>
                  <img
                    src={ServiceProviderIcon}
                    alt="Service Provider"
                    className="hidden sm:block w-[34px] h-[34px] sm:w-[44px] sm:h-[44px] md:w-[54px] md:h-[54px] lg:w-[64px] lg:h-[64px]"
                  />
                </div>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px] font-medium">
                  <h2 className="font-semibold">
                    Order #{order.orderNumber || order.id}
                  </h2>
                  <h2 className="text-gray-600">Location: {order.address}</h2>
                  <h2 className="text-gray-600">Area: {order.area}</h2>
                  <h2 className="text-gray-600">City: {order.city}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px]">
                  <h2>
                    Date:{' '}
                    {format(new Date(order.scheduledDate), 'MMM dd, yyyy')}
                  </h2>
                  <h2>Time: {formatDate(order.scheduledTime)}</h2>
                  <h2>Amount: Rs. {order.amount}</h2>
                  <h2>
                    Services:{' '}
                    {order.services
                      ?.map((service) =>
                        service.Service ? service.Service.name : service.title
                      )
                      .join(', ')}
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <div
                    className={`px-3 py-1 rounded-xl text-white text-center text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] ${
                      order.status === 'pending'
                        ? 'bg-yellow-500'
                        : order.status === 'accepted'
                          ? 'bg-green-500'
                          : order.status === 'completed'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                    }`}
                  >
                    {order.status}
                  </div>
                  {order.status === 'pending' && (
                    <button
                      className="bg-red-500 text-white p-1 sm:p-2 text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] rounded-xl"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default OrderList;
