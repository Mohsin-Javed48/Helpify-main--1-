import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import io from 'socket.io-client';
import { format } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';

const ServiceBidding = ({
  orderId,
  userId,
  serviceDetails,
  scheduledDate,
  scheduledTime,
  address,
  onSelectProvider,
  onBack,
}) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [counterOffer, setCounterOffer] = useState({});
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeCounterBid, setActiveCounterBid] = useState(null);
  const [waitingForBids, setWaitingForBids] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [counterOfferBid, setCounterOfferBid] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Initialize socket connection
  useEffect(() => {
    if (user?.token) {
      const newSocket = io(
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
        {
          auth: {
            token: user.token,
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
          newSocket.connect();
        }
      });

      return () => {
        if (newSocket) {
          console.log('Cleaning up socket connection');
          newSocket.disconnect();
        }
      };
    }
  }, [user]);

  // Fetch bids for the order when component mounts
  useEffect(() => {
    const fetchBids = async () => {
      try {
        if (orderId) {
          const response = await axiosInstance.get(`bids/order/${orderId}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });

          console.log('Fetched bids:', response.data);

          if (response.data.success) {
            setBids(response.data.bids);

            // If we have bids, stop waiting and loading
            if (response.data.bids && response.data.bids.length > 0) {
              setWaitingForBids(false);
              setLoading(false);

              // Clear refresh interval if it exists
              if (refreshInterval) {
                clearInterval(refreshInterval);
                setRefreshInterval(null);
              }
            }
          } else {
            setError('Failed to fetch bids');
            setLoading(false);
          }
        } else {
          // If no orderId, fallback to mock data for testing
          generateMockBids();
          setWaitingForBids(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
        setError('An error occurred while fetching bids');
        setLoading(false);
        // Don't set waitingForBids to false on error - we'll keep trying
      }
    };

    // Initial fetch
    fetchBids();

    // Set up polling interval to check for bids every 5 seconds
    const interval = setInterval(() => {
      if (waitingForBids) {
        console.log('Checking for new bids...');
        fetchBids();
      }
    }, 5000);

    setRefreshInterval(interval);

    // Join customer room for real-time updates
    if (userId && socket) {
      socket.emit('join_customer_room', userId);

      // Listen for new bids
      socket.on('new_bid', (data) => {
        console.log('New bid received via socket:', data);

        setBids((prev) => {
          // Check if bid already exists
          const exists = prev.some((bid) => bid.id === data.bid.id);
          if (exists) return prev;

          // Create a complete bid object with provider info
          const newBid = {
            ...data.bid,
            provider: data.provider,
            bidStatus: 'pending',
          };

          // Stop waiting for bids once we receive one
          setWaitingForBids(false);
          setLoading(false);

          return [...prev, newBid];
        });
      });
    }

    return () => {
      // Clean up socket listeners
      if (socket) {
        socket.off('new_bid');
      }

      // Clear interval
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [orderId, userId, socket, user?.token]);

  // Generate mock bids for testing
  const generateMockBids = () => {
    const mockBids = [
      {
        id: 1,
        serviceProviderId: 101,
        name: 'John Doe',
        designation: 'Senior Plumber',
        rating: 4.8,
        completedOrders: 132,
        successRate: '98%',
        responseTime: '15 min',
        originalPrice: calculateTotalPrice(),
        bidPrice: Math.round(
          calculateTotalPrice() * (0.9 + Math.random() * 0.2)
        ),
        bidMessage:
          'I can complete this job efficiently with high-quality work.',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        availabilityStatus: 'available',
        bidStatus: 'pending',
      },
      {
        id: 2,
        serviceProviderId: 102,
        name: 'Sarah Johnson',
        designation: 'Expert Electrician',
        rating: 4.7,
        completedOrders: 98,
        successRate: '96%',
        responseTime: '10 min',
        originalPrice: calculateTotalPrice(),
        bidPrice: Math.round(
          calculateTotalPrice() * (0.85 + Math.random() * 0.15)
        ),
        bidMessage:
          'I specialize in these services and can offer a competitive rate.',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        availabilityStatus: 'available',
        bidStatus: 'pending',
      },
      {
        id: 3,
        serviceProviderId: 103,
        name: 'Michael Smith',
        designation: 'Master Plumber',
        rating: 4.9,
        completedOrders: 215,
        successRate: '99%',
        responseTime: '5 min',
        originalPrice: calculateTotalPrice(),
        bidPrice: Math.round(
          calculateTotalPrice() * (0.95 + Math.random() * 0.25)
        ),
        bidMessage:
          "Premium service with guaranteed satisfaction. I'll ensure the job is done right the first time.",
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        availabilityStatus: 'available',
        bidStatus: 'pending',
      },
    ];

    setBids(mockBids);
    setLoading(false);
    setWaitingForBids(false);
  };

  const calculateTotalPrice = () => {
    return serviceDetails.reduce(
      (total, service) => total + service.price * service.quantity,
      0
    );
  };

  const handleAcceptBid = async (bid) => {
    try {
      if (orderId) {
        console.log(`Accepting bid ID: ${bid.id} for order: ${orderId}`);

        // Ensure we have a valid bid ID
        if (!bid.id) {
          console.error('Cannot accept bid: Missing bid ID');
          alert('Error: Cannot accept this bid because it is missing an ID');
          return false;
        }

        // Ensure user is authenticated
        if (!user?.token) {
          console.error('Cannot accept bid: User not authenticated');
          alert('Please log in to accept bids');
          return false;
        }

        const response = await axiosInstance.post(
          `bids/accept/${bid.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log('Accept bid response:', response.data);

        if (response.data.success) {
          console.log('Bid accepted:', response.data);
          setSelectedBid(bid);

          // Call parent callback with selected provider info
          onSelectProvider(bid.serviceProviderId, bid.bidPrice);
          return true;
        } else {
          console.error('Failed to accept bid:', response.data.message);
          alert(
            `Failed to accept bid: ${response.data.message || 'Unknown error'}`
          );
          return false;
        }
      } else {
        // Mock acceptance for testing
        setSelectedBid(bid);
        onSelectProvider(bid.serviceProviderId, bid.bidPrice);
        return true;
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('An error occurred while accepting the bid. Please try again.');
      return false;
    }
  };

  const handleCounterOffer = (bid) => {
    setActiveCounterBid(bid);
    setCounterOffer({
      bidId: bid.id,
      providerId: bid.serviceProviderId,
      originalBid: bid.bidPrice,
      counterAmount: '',
    });
    setShowCounterModal(true);
  };

  const submitCounterOffer = async () => {
    // Validate counter offer
    if (
      !counterOffer.counterAmount ||
      isNaN(counterOffer.counterAmount) ||
      parseFloat(counterOffer.counterAmount) <= 0
    ) {
      alert('Please enter a valid counter offer amount');
      return;
    }

    try {
      if (orderId) {
        const response = await axiosInstance.post(
          `bids/counter-offer/${counterOffer.bidId}`,
          {
            counterOfferPrice: parseFloat(counterOffer.counterAmount),
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.data.success) {
          // Update the UI with the counter offer
          const updatedBids = bids.map((bid) => {
            if (bid.id === counterOffer.bidId) {
              return {
                ...bid,
                bidStatus: 'counter_offered',
                customerCounterOffer: parseFloat(counterOffer.counterAmount),
                originalBidPrice: bid.bidPrice,
              };
            }
            return bid;
          });

          setBids(updatedBids);
          setShowCounterModal(false);

          // Show success message
          alert('Counter offer sent successfully!');
        } else {
          alert(response.data.message || 'Failed to send counter offer');
        }
      } else {
        // Mock counter offer for testing
        const updatedBids = bids.map((bid) => {
          if (bid.id === counterOffer.bidId) {
            return {
              ...bid,
              bidStatus: 'counter_offered',
              customerCounterOffer: parseFloat(counterOffer.counterAmount),
              originalBidPrice: bid.bidPrice,
            };
          }
          return bid;
        });

        setBids(updatedBids);
        setShowCounterModal(false);

        // Show success message
        alert('Counter offer sent successfully!');
      }
    } catch (error) {
      console.error('Error sending counter offer:', error);
      alert('Failed to send counter offer. Please try again.');
    }
  };

  const handleRejectBid = async (bid) => {
    try {
      if (orderId) {
        const response = await axiosInstance.post(
          `bids/reject/${bid.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.data.success) {
          // Remove bid from UI
          setBids((prev) => prev.filter((b) => b.id !== bid.id));
          alert('Bid rejected successfully');
        } else {
          alert(response.data.message || 'Failed to reject bid');
        }
      } else {
        // Mock rejection for testing
        setBids((prev) => prev.filter((b) => b.id !== bid.id));
        alert('Bid rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting bid:', error);
      alert('An error occurred while rejecting the bid');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getBidStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      counter_offered: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      pending: 'Pending',
      accepted: 'Accepted',
      counter_offered: 'Counter Offered',
      rejected: 'Rejected',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {statusLabels[status] || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Service Provider Bids</h2>

      {loading || waitingForBids ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin mx-auto rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">
            Waiting for service providers to bid...
          </h3>
          <p className="text-gray-600">
            This may take a few minutes. Service providers in your area are
            reviewing your request.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onBack}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Bids Available</h3>
          <p className="text-gray-600">
            We couldn't find any service providers available for your request at
            this time.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Choose Different Services
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <p className="text-green-600 font-semibold">
              {bids.length} service providers have sent bids for your request!
            </p>
            <p className="text-gray-600 text-sm">
              Review and select the best provider for your needs.
            </p>
          </div>

          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <img
                        src={
                          bid.profilePicture ||
                          'https://ui-avatars.com/api/?name=' +
                            encodeURIComponent(bid.name || 'Provider')
                        }
                        alt={bid.name || 'Service Provider'}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {bid.name || 'Service Provider'}
                        </h3>
                        <div className="flex items-center">
                          <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(bid.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">
                            (
                            {typeof bid.rating === 'number'
                              ? bid.rating.toFixed(1)
                              : '0.0'}
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700">
                        {bid.description ||
                          bid.bidMessage ||
                          'I can help with your service request. Please see my bid price.'}
                      </p>
                      {bid.expertise && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">
                            Expertise:{' '}
                          </span>
                          <span className="text-sm text-gray-600">
                            {bid.expertise}
                          </span>
                        </div>
                      )}
                      {bid.estimatedHours && (
                        <div className="mt-1">
                          <span className="text-sm font-medium text-gray-700">
                            Est. Hours:{' '}
                          </span>
                          <span className="text-sm text-gray-600">
                            {bid.estimatedHours}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end justify-between">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        $
                        {typeof bid.bidPrice === 'number'
                          ? bid.bidPrice.toFixed(2)
                          : bid.bidPrice}
                      </div>
                      {bid.originalPrice &&
                        bid.originalPrice !== bid.bidPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            $
                            {typeof bid.originalPrice === 'number'
                              ? bid.originalPrice.toFixed(2)
                              : bid.originalPrice}
                          </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleAcceptBid(bid)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Accept Bid
                      </button>
                      <button
                        onClick={() => {
                          setCounterOfferBid(bid);
                          setCounterOfferAmount('');
                          setShowCounterModal(true);
                        }}
                        className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        Counter Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={onBack}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!selectedBid) return;
                console.log('Continuing with selected provider:', selectedBid);
                onSelectProvider(
                  selectedBid.serviceProviderId,
                  selectedBid.bidPrice
                );
              }}
              disabled={!selectedBid}
              className={`px-6 py-2 rounded-md ${
                selectedBid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue with Selected Provider
            </button>
          </div>

          {/* Counter Offer Modal */}
          {showCounterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Make a Counter Offer</h3>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    You're negotiating with{' '}
                    <span className="font-medium">
                      {counterOfferBid?.name || 'Service Provider'}
                    </span>
                  </p>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-500">Original Bid:</span>
                    <span className="font-medium">
                      $
                      {typeof counterOfferBid?.bidPrice === 'number'
                        ? counterOfferBid?.bidPrice.toFixed(2)
                        : counterOfferBid?.bidPrice}
                    </span>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Counter Offer ($)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your counter offer"
                    value={counterOfferAmount}
                    onChange={(e) => setCounterOfferAmount(e.target.value)}
                  />
                  {parseFloat(counterOfferAmount) >
                    counterOfferBid?.bidPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      Your counter offer is higher than the original bid.
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowCounterModal(false);
                      setCounterOfferBid(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!counterOfferBid) return;

                      const newCounterOffer = {
                        bidId: counterOfferBid.id,
                        providerId: counterOfferBid.serviceProviderId,
                        originalBid: counterOfferBid.bidPrice,
                        counterAmount: counterOfferAmount,
                      };

                      setCounterOffer(newCounterOffer);
                      submitCounterOffer();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={
                      !counterOfferAmount ||
                      parseFloat(counterOfferAmount) > counterOfferBid?.bidPrice
                    }
                  >
                    Send Counter Offer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceBidding;
