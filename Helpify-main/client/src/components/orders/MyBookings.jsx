import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { useSelector } from 'react-redux';
import { selectAllBookings } from '../../store/bookingsSlice';
import Swal from 'sweetalert2';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const reduxBookings = useSelector(selectAllBookings);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // If user isn't logged in, redirect to login
        if (!user || !user.token) {
          Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'Please login to view your bookings',
          });
          navigate('/auth/login');
          return;
        }

        // Extract the user ID from token
        let userId;
        try {
          const tokenData = user.token;
          const base64Url = tokenData.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          userId = payload.id;
        } catch (error) {
          console.error('Error extracting user ID from token:', error);
          throw new Error('Failed to authenticate. Please login again.');
        }

        // Get bookings from API
        const response = await axiosInstance.get(`/order/user/${userId}`);
        console.log('Bookings from API:', response.data);

        if (response.data.success) {
          // Combine API bookings with Redux bookings
          const apiBookings = response.data.orders || [];

          // Create a set of IDs from API bookings to avoid duplicates
          const apiBookingIds = new Set(
            apiBookings.map((booking) => booking.id)
          );

          // Filter Redux bookings to only include those not already in API bookings
          const filteredReduxBookings = reduxBookings.filter(
            (booking) => !apiBookingIds.has(booking.id)
          );

          // Combine and sort by date (newest first)
          const combinedBookings = [
            ...apiBookings,
            ...filteredReduxBookings,
          ].sort(
            (a, b) =>
              new Date(b.createdAt || b.orderDate) -
              new Date(a.createdAt || a.orderDate)
          );

          setBookings(combinedBookings);
        } else {
          // If API call succeeded but returned no bookings, just use Redux bookings
          setBookings(reduxBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // On error, fallback to Redux bookings
        setBookings(reduxBookings);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load your bookings',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate, reduxBookings]);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status?.toLowerCase() === activeTab;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewBooking = (booking) => {
    navigate('/booking/confirmation', {
      state: {
        orderId: booking.id,
        bookingData: booking,
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

          {/* Filter tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('in progress')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'in progress'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'completed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'cancelled'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Cancelled
                </button>
              </nav>
            </div>
          </div>

          {/* Bookings */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{booking.id}
                          </h3>
                          <span
                            className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Booked on{' '}
                          {formatDate(booking.createdAt || booking.orderDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                          Rs {booking.amount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">
                            Scheduled Date
                          </p>
                          <p className="font-medium">
                            {formatDate(booking.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">
                            Scheduled Time
                          </p>
                          <p className="font-medium">
                            {booking.scheduledTime || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-500 text-sm">Services</p>
                        <div className="mt-2 flex flex-wrap">
                          {booking.services &&
                            booking.services.map((service, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center mr-2 mb-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                              >
                                {service.title || service.name} (
                                {service.quantity}x)
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="mt-1 text-gray-500">
                You haven't made any bookings yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book a Service
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
