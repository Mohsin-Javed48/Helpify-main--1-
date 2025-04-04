import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, bookingData } = location.state || {};

  React.useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-500 py-6 px-6 text-white text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="mt-2 text-xl">
              Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Order Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Order Number:</p>
                  <p className="font-medium">{orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Booking Date:</p>
                  <p className="font-medium">
                    {formatDate(bookingData.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Service Date:</p>
                  <p className="font-medium">
                    {formatDate(bookingData.scheduledDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Service Time:</p>
                  <p className="font-medium">{bookingData.scheduledTime}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Service Address
              </h2>
              <p className="text-gray-700">
                {bookingData.address}, {bookingData.area}, {bookingData.city},{' '}
                {bookingData.zipCode}
              </p>
              {bookingData.additionalInfo && (
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Additional Info:</span>{' '}
                  {bookingData.additionalInfo}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Services Booked
              </h2>
              <div className="space-y-4">
                {bookingData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-md bg-cover bg-center mr-4"
                        style={{ backgroundImage: `url(${service.image})` }}
                      ></div>
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="text-sm text-gray-600">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>
                        Rs {service.price} × {service.quantity}
                      </p>
                      <p className="font-medium">
                        Rs {service.price * service.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-800 font-medium">Total Amount:</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">
                    Rs {bookingData.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600">
                Your request has been sent to available service providers.
                You’ll be notified once a provider responds with their offer.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/services')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Book More Services
                </button>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
