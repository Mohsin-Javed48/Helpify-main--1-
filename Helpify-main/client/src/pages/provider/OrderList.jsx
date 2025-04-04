import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchActiveOrders } from '../../api/orders';
import axiosInstance from '../../api/axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import * as jwtDecode from 'jwt-decode';

const OrderList = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Get user ID from token
  const getUserId = () => {
    try {
      if (!user?.token) {
        return null;
      }
      const decoded = jwtDecode.jwtDecode(user.token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!user || !userId) {
      setError('Please log in to view orders');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await fetchActiveOrders(userId);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!user?.token) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      auth: { token: user.token },
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
      path: '/socket.io/',
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
      const userId = getUserId();
      if (userId) {
        newSocket.emit('join_provider_room', userId);
      }
    });

    // Listen for order updates
    newSocket.on('order_updated', async () => {
      const userId = getUserId();
      if (userId) {
        const fetchedOrders = await fetchActiveOrders(userId);
        setOrders(fetchedOrders);
      }
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };

    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    }`;
  };

  const handleUpdateBidStatus = async (bidId, status) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/bids/${status}/${bidId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.success) {
        const userId = getUserId();
        if (userId) {
          const fetchedOrders = await fetchActiveOrders(userId);
          setOrders(fetchedOrders);
        }
      } else {
        setError(`Failed to ${status} bid. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${status} bid:`, error);
      setError(`Failed to ${status} bid. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bids</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bids found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((bid) => (
            <div
              key={bid.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{bid.orderId}
                  </h3>
                  <p className="text-gray-600">
                    {bid.bidMessage || 'No description available'}
                  </p>
                </div>
                <span className={getStatusBadge(bid.status)}>
                  {bid.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">
                    {bid.order?.customerName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bid Date</p>
                  <p className="font-medium">{formatDate(bid.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bid Amount</p>
                  <p className="font-medium">${bid.bidAmount || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">
                    {bid.order?.serviceName || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {bid.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateBidStatus(bid.id, 'accept')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateBidStatus(bid.id, 'reject')}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                {bid.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateBidStatus(bid.id, 'start')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Start Work
                  </button>
                )}
                {bid.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateBidStatus(bid.id, 'complete')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
