import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import ServiceBidding from './ServiceBidding';

const BiddingDemo = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from context
    if (user) {
      setUserId(user.id);
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        if (orderId) {
          const response = await axiosInstance.get(`order/${orderId}`, {
            headers: {
              Authorization: `Bearer ${user?.token?.token}`,
            },
          });

          if (response.data.success) {
            setOrder(response.data.order);
          } else {
            setError('Failed to fetch order details');
          }
        } else {
          // Create mock order data for demo
          setOrder({
            id: 'demo-123',
            address: '123 Main St, Anytown, USA',
            scheduledDate: new Date().toISOString(),
            scheduledTime: '14:00',
            services: [
              { id: 1, name: 'Plumbing Service', price: 75, quantity: 1 },
              { id: 2, name: 'Pipe Replacement', price: 120, quantity: 1 },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(
          'An error occurred while fetching order details. Make sure you are logged in.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  const handleSelectProvider = (providerId, price) => {
    console.log(`Selected provider ${providerId} with price $${price}`);
    navigate('/booking/confirmation');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Order not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Service Provider Bidding</h1>

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Order ID: {order.id || 'Demo'}</p>
            <p className="text-gray-600">Address: {order.address}</p>
            <p className="text-gray-600">
              Date: {new Date(order.scheduledDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Time: {order.scheduledTime}</p>
          </div>
          <div>
            <p className="font-medium mb-2">Services:</p>
            <ul className="list-disc pl-5">
              {order.services?.map((service) => (
                <li key={service.id} className="text-gray-600">
                  {service.name || service.title} - ${service.price} x{' '}
                  {service.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ServiceBidding
        orderId={orderId}
        userId={userId}
        serviceDetails={order.services || []}
        scheduledDate={order.scheduledDate}
        scheduledTime={order.scheduledTime}
        address={order.address}
        onSelectProvider={handleSelectProvider}
        onBack={handleBack}
      />
    </div>
  );
};

export default BiddingDemo;
