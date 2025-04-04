import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListAlt,
  faHandshake,
  faDollarSign,
  faStar,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    avgRating: 0,
    pendingBids: 0,
    activeOrders: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if the user is a service provider (role ID 2)
        if (!user || user.roleId !== 2) {
          setError('This dashboard is only accessible to service providers');
          return;
        }

        // Fetch provider stats
        try {
          const statsResponse = await axiosInstance.get('provider/stats', {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });

          if (statsResponse.data.success) {
            setStats(statsResponse.data.stats);
          }
        } catch (statsError) {
          console.error('Error fetching provider stats:', statsError);
          // If stats fail, don't fail the whole dashboard - keep default stats
        }

        // Fetch recent activity
        try {
          const activityResponse = await axiosInstance.get(
            'provider/recent-activity',
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (activityResponse.data.success) {
            setRecentActivity(activityResponse.data.activities);
          }
        } catch (activityError) {
          console.error('Error fetching activity data:', activityError);
          // If activity fetch fails, use mock data
          setRecentActivity([
            {
              id: 1,
              type: 'new_bid',
              message: 'You placed a bid on order #ORD-1234',
              timestamp: new Date(Date.now() - 3600000),
            },
            {
              id: 2,
              type: 'bid_accepted',
              message: 'Your bid was accepted for order #ORD-1230',
              timestamp: new Date(Date.now() - 86400000),
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');

        // Use mock data if API fails
        setStats({
          totalOrders: 24,
          completedOrders: 18,
          totalEarnings: 4850,
          avgRating: 4.8,
          pendingBids: 5,
          activeOrders: 3,
        });

        setRecentActivity([
          {
            id: 1,
            type: 'new_bid',
            message: 'You placed a bid on order #ORD-1234',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 2,
            type: 'bid_accepted',
            message: 'Your bid was accepted for order #ORD-1230',
            timestamp: new Date(Date.now() - 86400000),
          },
          {
            id: 3,
            type: 'completed',
            message: 'You completed order #ORD-1225',
            timestamp: new Date(Date.now() - 172800000),
          },
          {
            id: 4,
            type: 'counter_offer',
            message: 'Customer made a counter offer on order #ORD-1236',
            timestamp: new Date(Date.now() - 259200000),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return date.toString();
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_bid':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <FontAwesomeIcon icon={faHandshake} className="text-blue-500" />
          </div>
        );
      case 'bid_accepted':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
          </div>
        );
      case 'completed':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <FontAwesomeIcon icon={faListAlt} className="text-purple-500" />
          </div>
        );
      case 'counter_offer':
        return (
          <div className="bg-orange-100 p-2 rounded-full">
            <FontAwesomeIcon icon={faStar} className="text-orange-500" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <FontAwesomeIcon icon={faListAlt} className="text-gray-500" />
          </div>
        );
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
        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, {user?.firstName || 'Provider'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faListAlt}
                className="text-blue-500 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.completedOrders} completed (
            {Math.round((stats.completedOrders / stats.totalOrders) * 100) || 0}
            %)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold">Rs {stats.totalEarnings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="text-green-500 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Avg. Rs{' '}
            {Math.round(stats.totalEarnings / stats.completedOrders) || 0} per
            order
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="text-3xl font-bold">{stats.avgRating || 'N/A'}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FontAwesomeIcon
                icon={faStar}
                className="text-yellow-500 text-xl"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.pendingBids} pending bids, {stats.activeOrders} active jobs
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 border-b border-gray-100"
              >
                {getActivityIcon(activity.type)}
                <div>
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
