import { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import axiosInstance from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import ServiceProviderIcon from '../../../public/ServiceProviderIcon.png';
import { format } from 'date-fns';
import * as jwtDecode from 'jwt-decode';

function Notification({ providerId, onOrderSelect }) {
  const { user, updateUserData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [counterOffers, setCounterOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    type: null,
    message: '',
    show: false,
  });
  const [socket, setSocket] = useState(null);

  // Fetch existing notifications on component mount
  useEffect(() => {
    async function fetchPendingOrders() {
      if (!providerId) {
        console.log('No provider ID provided, skipping API calls');
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching pending orders for provider ${providerId}`);

        // Fetch pending orders for this provider
        const response = await axiosInstance.get(
          `order/provider/${providerId}/pending`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Pending orders API response:', response.data);

        if (response.data.success && response.data.orders) {
          console.log(`Found ${response.data.orders.length} pending orders`);
          setOrders(response.data.orders);
        } else {
          console.log('No pending orders found or API returned error');
        }

        // Fetch counter offers
        console.log(`Fetching counter offers for provider ${providerId}`);
        const bidsResponse = await axiosInstance.get(
          `bids/provider/${providerId}/counter-offers`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        console.log('Counter offers API response:', bidsResponse.data);

        if (bidsResponse.data.success && bidsResponse.data.counterOffers) {
          console.log(
            `Found ${bidsResponse.data.counterOffers.length} counter offers`
          );
          setCounterOffers(bidsResponse.data.counterOffers);
        } else {
          console.log('No counter offers found or API returned error');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        console.error('Error details:', err.response?.data);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }

    // If we have a providerId, fetch data and connect to the socket
    if (providerId) {
      fetchPendingOrders();

      // Connect to the socket
      if (!socket) {
        console.log(
          'Initializing socket connection to',
          import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
        );
        const newSocket = io(
          import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
          {
            auth: {
              token: user?.token,
            },
            transports: ['polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            forceNew: true,
            path: '/socket.io/',
          }
        );

        newSocket.on('connect', () => {
          console.log('Socket connected with ID:', newSocket.id);
          setSocket(newSocket);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          // Try to reconnect after a delay
          setTimeout(() => {
            if (!newSocket.connected) {
              console.log('Attempting to reconnect...');
              newSocket.connect();
            }
          }, 5000);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            newSocket.connect();
          }
        });

        // Listen for socket events
        newSocket.on('new_order_request', handleNewOrderRequest);
        newSocket.on('counter_offer', handleCounterOffer);
        newSocket.on('bid_accepted', handleBidAccepted);
        newSocket.on('bid_rejected', handleBidRejected);

        // Clean up on unmount
        return () => {
          console.log('Cleaning up socket connection');
          newSocket.disconnect();
          newSocket.off('new_order_request', handleNewOrderRequest);
          newSocket.off('counter_offer', handleCounterOffer);
          newSocket.off('bid_accepted', handleBidAccepted);
          newSocket.off('bid_rejected', handleBidRejected);
        };
      } else {
        console.warn('Socket already initialized, real-time updates will work');
      }
    }
  }, [providerId, user, updateUserData]);

  // Socket event handlers
  const handleNewOrderRequest = (orderData) => {
    console.log('New order request received:', orderData);
    setOrders((prev) => {
      // Check if order already exists to avoid duplicates
      const exists = prev.some((order) => order.id === orderData.id);
      if (exists) return prev;
      return [...prev, orderData];
    });
  };

  const handleCounterOffer = (data) => {
    console.log('Counter offer received:', data);
    setCounterOffers((prev) => [...prev, data]);
    // Show notification
    showNotification(`New counter offer: Rs.${data.counterOfferPrice}`);
  };

  const handleBidAccepted = async (data) => {
    console.log('Bid accepted notification received:', data);
    setNotification({
      message: `Your bid for order #${data.orderId} has been accepted!`,
      type: 'success',
    });

    try {
      await updateUserData(user.token);
      console.log('User data updated after bid acceptance');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleBidRejected = (data) => {
    console.log('Bid rejected:', data);
    // Remove bid from pending list if needed
    showNotification('Your bid was rejected by the customer.');
  };

  // Helper function to show browser notifications
  const showNotification = (message) => {
    // Show an alert for now
    alert(message);

    // Optionally implement browser notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Helpify', { body: message });
    }
  };

  // Handle user interactions
  const handleBidClick = (order) => {
    if (onOrderSelect) {
      onOrderSelect(order);
    } else {
      // Fallback to the old prompt method if no callback is provided
      const bid = prompt('Enter your offer price:');
      const message = prompt('Add a message for the customer (optional):');

      if (bid) {
        submitBid(order.id, providerId, parseFloat(bid), message || '');
      }
    }
  };

  const submitBid = async (
    orderId,
    serviceProviderId,
    bidPrice,
    bidMessage
  ) => {
    try {
      // We need to use the ServiceProvider ID, not the User ID
      // So make sure we have a valid provider ID
      if (!serviceProviderId) {
        console.error('No service provider ID available');
        showNotification('Failed to send bid: Provider ID not found');
        return;
      }

      console.log('Submitting bid with data:', {
        orderId,
        serviceProviderId,
        bidPrice,
        bidMessage,
      });

      const response = await axiosInstance.post(
        '/bids',
        {
          orderId,
          serviceProviderId,
          bidPrice,
          bidMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        showNotification('Bid sent successfully!');
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      }
    } catch (error) {
      console.error('Error sending bid:', error);
      showNotification(
        'Failed to send bid: ' +
          (error.response?.data?.message || error.message || 'Unknown error')
      );
    }
  };

  const handleReject = async (orderId) => {
    try {
      console.log(`Rejecting order ${orderId}`);

      // First update local state to provide immediate feedback
      setOrders((prev) => prev.filter((order) => order.id !== orderId));

      // Send the socket event for real-time notification
      if (socket) {
        socket.emit('reject_order', { orderId, providerId });
      }

      // Also make an API call to properly update the database
      const response = await axiosInstance
        .post(
          `/order/${orderId}/reject`,
          { providerId },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .catch((error) => {
          console.error('Error making API call to reject order:', error);
          // If the API call fails, we've already updated the UI, so just log the error
        });

      if (response?.data?.success) {
        console.log(`Order ${orderId} rejected successfully in the database`);
      }

      showNotification('Order rejected successfully');
    } catch (error) {
      console.error('Error rejecting order:', error);
      // We don't revert the UI change here to avoid confusion
      showNotification('Order removed from your list');
    }
  };

  const handleAcceptCounterOffer = async (counterOffer) => {
    try {
      const response = await axiosInstance.post(
        `bids/accept/${counterOffer.bid.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        showNotification('Counter offer accepted successfully!');
        setCounterOffers((prev) =>
          prev.filter((offer) => offer.bid.id !== counterOffer.bid.id)
        );
      }
    } catch (error) {
      console.error('Error accepting counter offer:', error);
      showNotification('Failed to accept counter offer.');
    }
  };

  const handleRejectCounterOffer = async (counterOffer) => {
    try {
      const response = await axiosInstance.post(
        `bids/reject/${counterOffer.bid.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        showNotification('Counter offer rejected!');
        setCounterOffers((prev) =>
          prev.filter((offer) => offer.bid.id !== counterOffer.bid.id)
        );
      }
    } catch (error) {
      console.error('Error rejecting counter offer:', error);
      showNotification('Failed to reject counter offer.');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Incoming Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No new orders at the moment.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center p-4 bg-white shadow rounded-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={ServiceProviderIcon}
                  alt="icon"
                  className="w-14 h-14"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {order.title || 'New Service Request'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {order.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(order.scheduledDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {order.scheduledTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: Rs.{order.amount}
                  </p>
                  {order.services && (
                    <p className="text-sm text-gray-600">
                      Services:{' '}
                      {Array.isArray(order.services)
                        ? order.services
                            .map((service) => service.title || service.name)
                            .join(', ')
                        : typeof order.services === 'string'
                          ? order.services
                          : 'No services specified'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBidClick(order)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Bid
                </button>
                <button
                  onClick={() => handleReject(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {counterOffers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Counter Offers</h2>
          <div className="space-y-4 mt-4">
            {counterOffers.map((offer) => (
              <div
                key={offer.bid.id}
                className="flex justify-between items-center p-4 bg-white shadow rounded-md"
              >
                <div>
                  <p className="text-lg font-semibold">
                    Counter Offer for Order #{offer.orderId}
                  </p>
                  <p className="text-sm text-gray-600">
                    New Price: Rs.{offer.counterOfferPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your Original Bid: Rs.{offer.bid.bidPrice}
                  </p>
                  {offer.message && (
                    <p className="text-sm text-gray-600">
                      Message: {offer.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptCounterOffer(offer)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectCounterOffer(offer)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
