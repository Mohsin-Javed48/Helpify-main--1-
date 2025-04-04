import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import { useSelector } from 'react-redux';
import { selectAllBookings } from '../../store/bookingsSlice';

const ContinueToBookingButton = () => {
  const navigate = useNavigate();
  const { ordersList } = useOrders();
  const bookings = useSelector(selectAllBookings);

  // Only show if there are items in the cart
  if (!ordersList || ordersList.length === 0) {
    return null;
  }

  // Calculate the total items and amount
  const totalItems = ordersList.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalAmount = ordersList.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center justify-center bg-blue-600 text-white text-sm font-medium rounded-full h-6 min-w-6 px-2 mr-2">
              {totalItems}
            </span>
            <span className="text-gray-800 font-medium">Items in Cart</span>
          </div>
          <div className="text-center sm:text-left">
            <span className="text-gray-800 font-medium">Total: </span>
            <span className="text-blue-600 font-bold">Rs {totalAmount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {bookings.length > 0 && (
            <button
              onClick={() => navigate('/my-bookings')}
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
            >
              My Bookings ({bookings.length})
            </button>
          )}

          <button
            onClick={() => navigate('/booking')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center"
          >
            <span>Continue to Booking</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueToBookingButton;
