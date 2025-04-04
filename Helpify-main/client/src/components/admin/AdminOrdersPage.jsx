import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { format } from 'date-fns';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/order');
        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          setError('Please login to view orders');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch orders');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    const parsedAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(parsedAmount) ? '0.00' : parsedAmount.toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-[rgba(255,193,7,0.10)] text-[#FFC107]';
      case 'accepted':
      case 'in_progress':
        return 'bg-[rgba(0,123,255,0.10)] text-[#007BFF]';
      case 'completed':
        return 'bg-[rgba(0,222,115,0.10)] text-[#00DE73]';
      case 'cancelled':
      case 'rejected':
        return 'bg-[rgba(255,56,56,0.10)] text-[#FF3838]';
      default:
        return 'bg-[rgba(108,117,125,0.10)] text-[#6C757D]';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-4 w-full min-h-[100vh] bg-[#161928] flex items-center justify-center">
        <div className="text-[#ADB3CC]">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-4 w-full min-h-[100vh] bg-[#161928] flex items-center justify-center">
        <div className="text-[#FF3838]">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/*Orders*/}
      <div className="px-4 sm:px-6  py-4 w-full min-h-[100vh] bg-[#161928]">
        {/* Page Title */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px] mt-2">
          Orders
        </h2>
        {/* Table */}
        <div className="overflow-x-auto mt-7 mb-7">
          <table className="min-w-full rounded-lg text-left border-collapse">
            <thead className="bg-[#1D2134] hidden md:table-header-group">
              <tr className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.48]">
                <th className="py-3 px-4 sm:py-4 sm:px-6">Order Number</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Customer</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Service Provider</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Scheduled Date</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Amount</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Status</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">Payment Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.18] border-b border-[#2E3348] md:table-row block w-full mb-4 md:mb-0"
                >
                  {/* Order Number */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Order Number:{' '}
                    </span>
                    {order.orderNumber || `ORD-${order.id}`}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Customer:{' '}
                    </span>
                    {order.customer
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : 'Guest'}
                  </td>

                  {/* Service Provider */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Service Provider:{' '}
                    </span>
                    {order.serviceProvider?.User
                      ? `${order.serviceProvider.User.firstName} ${order.serviceProvider.User.lastName}`
                      : 'Not Assigned'}
                  </td>

                  {/* Scheduled Date */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Scheduled Date:{' '}
                    </span>
                    {formatDate(order.scheduledDate)}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Amount:{' '}
                    </span>
                    {formatAmount(order.amount)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Status:{' '}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-[4px] ${getStatusColor(order.status)}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Payment Status:{' '}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-[4px] ${
                        order.paymentStatus?.toLowerCase() === 'completed'
                          ? 'bg-[rgba(0,222,115,0.10)] text-[#00DE73]'
                          : 'bg-[rgba(255,56,56,0.10)] text-[#FF3838]'
                      }`}
                    >
                      {formatStatus(order.paymentStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminOrdersPage;
