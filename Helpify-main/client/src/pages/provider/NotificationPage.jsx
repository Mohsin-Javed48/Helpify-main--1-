import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import Notification from '../../components/shared/Notification';
import BidForm from '../../components/provider/BidForm';
import * as jwtDecode from 'jwt-decode';

function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providerInfo, setProviderInfo] = useState(null);

  // Fetch provider information when the component mounts
  useEffect(() => {
    async function fetchProviderInfo() {
      if (user && user.token) {
        try {
          setLoading(true);
          setError(null);

          // Get user ID from the JWT token
          const decodedToken = jwtDecode.jwtDecode(user.token);
          const userId = decodedToken.id;

          console.log('Decoded token:', decodedToken);
          console.log('Attempting to fetch provider info for user:', userId);
          console.log(
            'Current user token:',
            user.token.substring(0, 20) + '...'
          );

          // Get provider information for this user
          const response = await axiosInstance.get(`provider/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          console.log('Provider API response:', response.data);

          if (response.data.success) {
            setProviderInfo(response.data.provider);
            console.log('Provider info set:', response.data.provider.id);
          } else {
            setError('Failed to get provider information');
            console.error('Provider fetch failed:', response.data);
          }
        } catch (err) {
          console.error('Error fetching provider info:', err);
          console.error('Error details:', err.response?.data);
          setError('Error loading provider information');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user data available or missing token');
        setLoading(false);
      }
    }

    fetchProviderInfo();

    // Reset the form state when the user changes
    setSelectedOrder(null);
    setShowBidForm(false);
  }, [user]);

  // Handler for when a provider selects an order to bid on
  const handleOrderSelect = (order) => {
    console.log('Order selected for bidding:', order.id);
    setSelectedOrder(order);
    setShowBidForm(true);
  };

  // Handler for bid submission success
  const handleBidSuccess = () => {
    console.log('Bid submitted successfully');
    setShowBidForm(false);
    setSelectedOrder(null);
    // Maybe add a success message
  };

  // Handler to cancel the bid form
  const handleBidCancel = () => {
    console.log('Bid form cancelled');
    setShowBidForm(false);
  };

  // Render loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {showBidForm ? (
        <BidForm
          order={selectedOrder}
          onSuccess={handleBidSuccess}
          onCancel={handleBidCancel}
          providerInfo={providerInfo}
        />
      ) : (
        <div>
          {error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          ) : !providerInfo ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-700">
                Please log in as a service provider to see notifications.
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                Current user role ID: {user?.roleId}
              </p>
            </div>
          ) : (
            <Notification
              providerId={providerInfo.id}
              onOrderSelect={handleOrderSelect}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
