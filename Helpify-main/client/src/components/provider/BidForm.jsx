import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { format } from 'date-fns';

function BidForm({ order, onSuccess, onCancel, providerInfo }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bidPrice, setBidPrice] = useState(order?.amount || 0);
  const [bidMessage, setBidMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!providerInfo || !providerInfo.id) {
        throw new Error(
          'Provider information not loaded. Please refresh and try again.'
        );
      }

      // Use the actual provider ID from provider info
      const serviceProviderId = providerInfo.id;

      // Parse and validate the bid price
      const parsedBidPrice = parseFloat(bidPrice);
      if (isNaN(parsedBidPrice) || parsedBidPrice <= 0) {
        throw new Error('Please enter a valid bid price greater than 0');
      }

      const bidData = {
        orderId: order.id,
        serviceProviderId,
        bidPrice: parsedBidPrice,
        bidMessage: bidMessage.trim() || '',
      };

      console.log('Submitting bid with data:', bidData);

      // Check if all required fields are present
      if (!order.id) {
        throw new Error('Order ID is missing');
      }
      if (!serviceProviderId) {
        throw new Error('Service Provider ID is missing');
      }

      // Use axiosInstance instead of fetch
      const response = await axiosInstance.post('/bids', bidData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log('Bid submission response:', response.data);

      if (response.data.success) {
        // Show success message and call onSuccess
        alert('Bid submitted successfully!');

        if (onSuccess) {
          onSuccess(response.data.bid);
        } else {
          navigate('/provider/notification');
        }
      } else {
        setError(response.data.message || 'Failed to submit bid');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);

      // Provide a more detailed error message
      let errorMessage =
        'An error occurred while submitting your bid. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (!order) {
    return (
      <div className="text-center p-4">No order information available</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit a Bid</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Order Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date & Time:</p>
            <p className="font-medium">
              {formatDate(order.scheduledDate)} at {order.scheduledTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location:</p>
            <p className="font-medium">{order.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer Budget:</p>
            <p className="font-medium">Rs. {order.amount}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Services:</p>
          <ul className="list-disc pl-5 mt-1">
            {order.services?.map((service, index) => (
              <li key={index} className="text-sm">
                {service.title || service.name}
                {service.quantity > 1 ? ` × ${service.quantity}` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="bidPrice"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Bid Price (Rs.)
          </label>
          <input
            type="number"
            id="bidPrice"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="0.01"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Customer's budget is Rs. {order.amount}. Competitive bids have
            higher chances of selection.
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="bidMessage"
            className="block text-gray-700 font-medium mb-2"
          >
            Message to Customer (Optional)
          </label>
          <textarea
            id="bidMessage"
            value={bidMessage}
            onChange={(e) => setBidMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Explain why you're the best service provider for this job..."
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            A personalized message increases your chances of getting selected.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Bid'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BidForm;
