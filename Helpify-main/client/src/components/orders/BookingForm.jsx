import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import ServiceBidding from './ServiceBidding';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';
import {
  setBookingFormData,
  updateBookingField,
  setBookingServices,
  selectServiceProvider,
  saveBooking,
  selectCurrentBooking,
  selectAllBookings,
} from '../../store/bookingsSlice';

function BookingForm() {
  const navigate = useNavigate();
  const { ordersList } = useOrders();
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const currentBooking = useSelector(selectCurrentBooking);
  const bookings = useSelector(selectAllBookings);

  // Debug user info
  useEffect(() => {
    console.log('User object in BookingForm:', user);
    if (user?.token) {
      console.log('Token found in user object');
    } else {
      console.log(
        'No token found in user object, structure:',
        JSON.stringify(user)
      );
    }
  }, [user]);

  // Local state just for UI steps
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize booking services on component mount
  useEffect(() => {
    dispatch(setBookingServices(ordersList));
  }, [ordersList, dispatch]);

  // Calculate total services and amount
  const totalServices = ordersList.reduce(
    (total, order) => total + order.quantity,
    0
  );
  const totalAmount = ordersList.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBookingField({ field: name, value }));
  };

  const handleDateChange = (e) => {
    dispatch(
      updateBookingField({ field: 'scheduledDate', value: e.target.value })
    );
  };

  const handleTimeChange = (e) => {
    dispatch(
      updateBookingField({ field: 'scheduledTime', value: e.target.value })
    );
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleProviderSelect = (providerId, bidPrice) => {
    dispatch(selectServiceProvider({ providerId, bidPrice }));
    setCurrentStep(4); // Move to payment step
  };

  const handlePaymentMethodSelect = (method) => {
    dispatch(updateBookingField({ field: 'paymentMethod', value: method }));
  };

  // Extract the actual user ID from the token payload
  const getUserIdFromToken = (token) => {
    try {
      // Decode the JWT token to get the user ID
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Failed to get user ID from token');
    }
  };

  const handleSubmitBooking = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Login Required',
          text: 'Please log in to complete your booking',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          navigate('/auth/login');
        });
        return;
      }

      // Extract the actual user ID from the token payload
      let userId;
      if (user?.token) {
        try {
          userId = getUserIdFromToken(user.token);
          console.log('Using user ID from token:', userId);
        } catch (error) {
          console.error('Error decoding token:', error);
          throw new Error('Failed to get user ID from token');
        }
      }

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Map services properly to match what the server expects
      const formattedServices = ordersList.map((service) => ({
        id: service.id,
        serviceId: service.id,
        title: service.title || service.name,
        subtitle: service.subtitle || service.description,
        image: service.image,
        quantity: service.quantity || 1,
        price: service.price,
      }));

      console.log('Formatted services array:', formattedServices);

      const bookingData = {
        userId: userId,
        serviceProviderId: 1, // Add a default service provider ID (we'll update this later when a provider bids)
        title: `Direct Booking - ${new Date().toLocaleDateString()}`, // Adding a default title
        address: currentBooking.address,
        area: currentBooking.area,
        city: currentBooking.city,
        zipCode: currentBooking.zipCode,
        additionalInfo: currentBooking.additionalInfo || '',
        scheduledDate: currentBooking.scheduledDate,
        scheduledTime: currentBooking.scheduledTime,
        amount: totalAmount,
        services: formattedServices,
        status: 'pending',
        paymentStatus: 'pending',
      };

      console.log('Sending booking data to server:', bookingData);

      try {
        // Send the data to the backend API with token in headers
        const response = await axiosInstance.post('order', bookingData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log('Server response:', response.data);

        if (response.data.success) {
          // Save the booking to the Redux store
          dispatch(saveBooking(bookingData));

          // Get the booking with ID from the response to pass to confirmation page
          const completeBookingData = {
            ...currentBooking,
            ...bookingData,
            id:
              response.data.order.id ||
              'ORD-' + Math.floor(Math.random() * 10000),
          };

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Booking Successful!',
            text: 'Your order has been placed successfully.',
            confirmButtonText: 'Continue',
          }).then(() => {
            // Navigate to booking confirmation page with all the necessary data
            navigate('/booking/confirmation', {
              state: {
                orderId: response.data.order.id || completeBookingData.id,
                bookingData: {
                  ...bookingData,
                  orderDate: new Date().toISOString(),
                  services: formattedServices,
                  id: response.data.order.id || completeBookingData.id,
                },
              },
            });
          });
        } else {
          throw new Error(response.data.message || 'Failed to create order');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error response data:', error.response?.data);
        console.error('Error status:', error.response?.status);

        // Get detailed error message from server
        let errorMessage = 'There was a problem processing your booking.';

        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: errorMessage,
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      console.error('Error in booking process:', error);

      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.message || 'There was a problem with your booking.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const createOrderForBidding = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Login Required',
          text: 'Please log in to create an order for bidding',
          confirmButtonText: 'Go to Login',
        }).then(() => {
          navigate('/auth/login');
        });
        return;
      }

      // Extract the actual user ID from the token payload
      let userId;
      if (user?.token) {
        try {
          userId = getUserIdFromToken(user.token);
          console.log('Using user ID from token for bidding:', userId);
        } catch (error) {
          console.error('Error decoding token:', error);
          throw new Error('Failed to get user ID from token');
        }
      }

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Format the services for the API
      const formattedServices = ordersList.map((service) => ({
        id: service.id,
        serviceId: service.id,
        quantity: service.quantity,
        price: service.price,
      }));

      // Create the order without assigning a service provider
      const orderData = {
        userId: userId,
        serviceProviderId: 1, // Use a default service provider ID temporarily for bidding
        title: `Service Request - ${new Date().toLocaleDateString()}`, // Adding a default title
        address: currentBooking.address,
        area: currentBooking.area,
        city: currentBooking.city,
        zipCode: currentBooking.zipCode,
        additionalInfo: currentBooking.additionalInfo,
        scheduledDate: currentBooking.scheduledDate,
        scheduledTime: currentBooking.scheduledTime,
        amount: totalAmount,
        services: formattedServices,
      };

      console.log('Creating order for bidding:', orderData);

      // Send the order to the API with token in headers
      const response = await axiosInstance.post('order', orderData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.success) {
        // Navigate to the bidding page for this order
        navigate(`/booking/bids/${response.data.order.id}`);

        Swal.fire({
          icon: 'success',
          title: 'Order Created for Bidding',
          text: 'Your order has been created and service providers are being notified. You can now view their bids.',
          confirmButtonText: 'View Bids',
        });

        // Save the order to Redux
        dispatch(saveBooking(response.data.order));
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order for bidding:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Creation Failed',
        text:
          error.message ||
          'There was a problem creating your order for bidding.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  // Validate if step can proceed
  const validateStep = () => {
    switch (currentStep) {
      case 1: // Service selection
        return ordersList.length > 0;
      case 2: // Date and time
        return currentBooking.scheduledDate && currentBooking.scheduledTime;
      case 3: // Address information
        return (
          currentBooking.address &&
          currentBooking.city &&
          currentBooking.area &&
          currentBooking.zipCode
        );
      case 4: // Payment method
        return true;
      default:
        return false;
    }
  };

  // Render step 1: Service Selection Review
  const renderServicesStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Your Selected Services
      </h2>

      {ordersList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No services selected yet.</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {ordersList.map((service, index) => (
              <div
                key={`${service.id}-${index}`}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center">
                  <div
                    className="w-16 h-16 rounded-md bg-cover bg-center mr-4"
                    style={{ backgroundImage: `url(${service.image})` }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-lg">{service.title}</h3>
                    <p className="text-gray-500">{service.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    Rs {service.price} × {service.quantity}
                  </p>
                  <p className="text-gray-600">
                    Rs {service.price * service.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-gray-600">Total Services:</p>
              <p className="font-bold text-xl">{totalServices} items</p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount:</p>
              <p className="font-bold text-xl text-blue-600">
                Rs {totalAmount}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render step 2: Date and Time Selection
  const renderDateTimeStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Schedule Your Service
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Select Date
          </label>
          <input
            type="date"
            name="selectedDate"
            value={currentBooking.scheduledDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Select Time
          </label>
          <select
            name="selectedTime"
            value={currentBooking.scheduledTime}
            onChange={handleTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a time</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="01:00 PM">01:00 PM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:00 PM">03:00 PM</option>
            <option value="04:00 PM">04:00 PM</option>
            <option value="05:00 PM">05:00 PM</option>
          </select>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-sm flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Our service providers are available from 9 AM to 5 PM. Please select
            a convenient time for your service.
          </p>
        </div>
      </div>
    </div>
  );

  // Render step 3: Address Information
  const renderAddressStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Service Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={currentBooking.address}
            onChange={handleInputChange}
            placeholder="House #, Street #"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Area</label>
          <input
            type="text"
            name="area"
            value={currentBooking.area}
            onChange={handleInputChange}
            placeholder="Neighborhood/Area"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">City</label>
          <input
            type="text"
            name="city"
            value={currentBooking.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="zipCode"
            value={currentBooking.zipCode}
            onChange={handleInputChange}
            placeholder="Postal/Zip Code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Additional Information (Optional)
        </label>
        <textarea
          name="additionalInfo"
          value={currentBooking.additionalInfo}
          onChange={handleInputChange}
          placeholder="Special instructions or directions"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
        ></textarea>
      </div>
    </div>
  );

  // Render step 4: Payment Method
  const renderPaymentStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Payment Method</h2>

      <div className="space-y-4">
        <div
          className={`border rounded-lg p-4 cursor-pointer flex items-center ${
            currentBooking.paymentMethod === 'cash'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}
          onClick={() => handlePaymentMethodSelect('cash')}
        >
          <div
            className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
              currentBooking.paymentMethod === 'cash'
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}
          >
            {currentBooking.paymentMethod === 'cash' && (
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div>
            <p className="font-semibold">Cash on Delivery</p>
            <p className="text-gray-500 text-sm">
              Pay cash to service provider after service completion
            </p>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 cursor-pointer flex items-center ${
            currentBooking.paymentMethod === 'card'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}
          onClick={() => handlePaymentMethodSelect('card')}
        >
          <div
            className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
              currentBooking.paymentMethod === 'card'
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}
          >
            {currentBooking.paymentMethod === 'card' && (
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div>
            <p className="font-semibold">Credit/Debit Card</p>
            <p className="text-gray-500 text-sm">
              Pay securely with your credit or debit card
            </p>
          </div>
        </div>

        <div
          className={`border rounded-lg p-4 cursor-pointer flex items-center ${
            currentBooking.paymentMethod === 'easypaisa'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}
          onClick={() => handlePaymentMethodSelect('easypaisa')}
        >
          <div
            className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
              currentBooking.paymentMethod === 'easypaisa'
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}
          >
            {currentBooking.paymentMethod === 'easypaisa' && (
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div>
            <p className="font-semibold">Easypaisa</p>
            <p className="text-gray-500 text-sm">
              Pay through your Easypaisa account
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">Rs {currentBooking.amount}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Service Charges:</span>
          <span className="font-semibold">Rs 0</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-600 font-bold">Total:</span>
          <span className="font-bold text-xl text-blue-600">
            Rs {currentBooking.amount}
          </span>
        </div>
      </div>
    </div>
  );

  // Render step 4: Bidding Options
  const renderBiddingOptionsStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Choose Your Booking Method
      </h2>

      <div className="space-y-6">
        <div className="p-6 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            Get Bids from Service Providers
          </h3>
          <p className="text-gray-700 mb-4">
            Create an order and let service providers bid on it. Compare prices
            and choose the best offer.
          </p>
          <div className="flex justify-between items-center">
            <ul className="text-sm text-gray-600 list-disc pl-5">
              <li>Compare multiple service provider offers</li>
              <li>Negotiate prices with counter-offers</li>
              <li>Choose based on price and ratings</li>
            </ul>
            <button
              onClick={createOrderForBidding}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Bids
            </button>
          </div>
        </div>

        <div className="p-6 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-all cursor-pointer">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Direct Booking
          </h3>
          <p className="text-gray-700 mb-4">
            Book a service at the standard rate and we'll assign the best
            available provider.
          </p>
          <div className="flex justify-between items-center">
            <ul className="text-sm text-gray-600 list-disc pl-5">
              <li>Quicker booking process</li>
              <li>Fixed standard pricing</li>
              <li>Provider assigned based on availability</li>
            </ul>
            <button
              onClick={handleNextStep}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render different steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderServicesStep();
      case 2:
        return renderDateTimeStep();
      case 3:
        return renderAddressStep();
      case 4:
        return renderBiddingOptionsStep();
      case 5:
        return renderPaymentStep();
      default:
        return null;
    }
  };

  // Progress bar calculation
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Book Your Service
            </h1>
            <p className="text-gray-600">
              Complete your booking in a few simple steps
            </p>
          </div>
          {bookings && bookings.length > 0 && (
            <button
              onClick={() => navigate('/my-bookings')}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm5 1v1h2V4H8zm-2 2v1h6V6H6zm8 0v1h2V6h-2zm0 3v1h2V9h-2zM6 9v1h6V9H6zm-2 3v1h6v-1H4zm8 0v1h4v-1h-4zm-8 3v1h4v-1H4zm8 0v1h4v-1h-4z"
                  clipRule="evenodd"
                />
              </svg>
              View My Bookings ({bookings.length})
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Step {currentStep} of 5
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={validateStep() ? handleNextStep : null}
              disabled={!validateStep()}
              className={`px-6 py-3 rounded-lg transition-all ml-auto ${
                validateStep()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          ) : null}

          {currentStep === 5 && (
            <button
              onClick={handleSubmitBooking}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              Complete Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
