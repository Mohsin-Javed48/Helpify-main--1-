import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faEdit,
  faBan,
  faCheck,
  faSort,
  faSortUp,
  faSortDown,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../api/axios';

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) return token;

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token?.token) {
          localStorage.setItem('authToken', user.token.token);
          return user.token.token;
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    return null;
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axiosInstance.get('users');
      const customersData = Array.isArray(response.data)
        ? response.data
        : response.data.users
          ? response.data.users
          : [];
      setCustomers(customersData);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError(
        err.response?.data?.message ||
          'Failed to fetch customers. Please try again later.'
      );
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} />;
    return sortDirection === 'asc' ? (
      <FontAwesomeIcon icon={faSortUp} />
    ) : (
      <FontAwesomeIcon icon={faSortDown} />
    );
  };

  const handleStatusToggle = async (customerId, currentStatus) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axiosInstance.patch(`users/${customerId}/status`, {
        status: newStatus,
      });

      setCustomers(
        customers.map((customer) =>
          customer.id === customerId
            ? { ...customer, status: newStatus }
            : customer
        )
      );

      alert(
        `User has been ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`
      );
    } catch (err) {
      console.error('Error toggling user status:', err.response || err);
      alert(
        err.response?.data?.message ||
          'Failed to update user status. Please try again.'
      );
    }
  };

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter(
        (customer) =>
          (customer?.name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (customer?.email || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortField === 'orders') {
      return sortDirection === 'asc'
        ? (a.orders || 0) - (b.orders || 0)
        : (b.orders || 0) - (a.orders || 0);
    }

    const aValue = (a[sortField] || '').toString();
    const bValue = (b[sortField] || '').toString();

    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#0f111a]">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2x"
          className="text-blue-400"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#0f111a]">
        <div
          className="bg-red-900 border border-red-500 text-red-100 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0f111a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-200">Customers</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 rounded-lg bg-[#1c1f2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {sortedCustomers.length === 0 ? (
        <div className="rounded-lg p-6 text-center text-gray-500 bg-[#1c1f2e]">
          No customers found.
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <table className="min-w-full bg-[#1c1f2e]">
            <thead className="bg-[#1a1d2b]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Name {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Contact
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Join Date {getSortIcon('createdAt')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('orders')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Orders {getSortIcon('orders')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Status Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#2a2e40]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {customer.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div>{customer.email || 'N/A'}</div>
                    <div className="text-gray-400 text-xs">
                      {customer.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {customer.orders || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {customer.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() =>
                        handleStatusToggle(customer.id, customer.status)
                      }
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        customer.status === 'active'
                          ? 'bg-red-700 text-white hover:bg-red-600'
                          : 'bg-green-700 text-white hover:bg-green-600'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={customer.status === 'active' ? faBan : faCheck}
                      />
                      {customer.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Customers;
