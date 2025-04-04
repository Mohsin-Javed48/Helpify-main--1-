import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBan,
  faCheck,
  faSort,
  faSortUp,
  faSortDown,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../api/axios';
import Swal from 'sweetalert2';

function ServiceProviders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return token;
    }

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

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get('/provider');
      console.log('API Response:', response.data);

      // The backend now returns the array directly
      const providersData = response.data;

      setProviders(providersData);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError(
        err.response?.data?.message ||
          'Failed to fetch service providers. Please try again later.'
      );
      setProviders([]);
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

  const handleStatusToggle = async (providerId, currentStatus) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

      // Update using PUT method
      const response = await axiosInstance.put(`provider/${providerId}`, {
        status: newStatus,
        availabilityStatus: newStatus === 'active' ? 'available' : 'offline',
      });

      // Update the local state with the returned provider data
      if (response.data.success && response.data.provider) {
        setProviders(
          providers.map((provider) =>
            provider.id === providerId ? response.data.provider : provider
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Service provider has been ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`,
          confirmButtonColor: '#007bff',
        });
      } else {
        throw new Error(
          response.data.message || 'Failed to update provider status'
        );
      }
    } catch (err) {
      console.error('Error toggling provider status:', err.response || err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          err.response?.data?.message ||
          'Failed to update provider status. Please try again.',
        confirmButtonColor: '#007bff',
      });
    }
  };

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const aValue = (a[sortField] || '').toString();
    const bValue = (b[sortField] || '').toString();

    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2x"
          className="text-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 w-full min-h-[100vh] bg-[#161928]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px]">
          Service Providers
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search providers..."
            className="pl-10 pr-4 py-2 border rounded-lg bg-[#1D2134] text-[#ADB3CC] border-[#2E3348] focus:outline-none focus:ring-2 focus:ring-[#0049A8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ADB3CC]"
          />
        </div>
      </div>

      {sortedProviders.length === 0 ? (
        <div className="bg-[#1D2134] rounded-lg p-6 text-center text-[#ADB3CC]">
          No service providers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg text-left">
            <thead className="bg-[#1D2134] hidden md:table-header-group">
              <tr className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.48]">
                <th className="py-3 px-4 sm:py-4 sm:px-6">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    NAME {getSortIcon('name')}
                  </div>
                </th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">CONTACT</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    JOINED {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">DESIGNATION</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">STATUS</th>
                <th className="py-3 px-4 sm:py-4 sm:px-6">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedProviders.map((provider) => (
                <tr
                  key={provider.id}
                  className="text-[#ADB3CC] text-xs sm:text-sm md:text-base font-medium font-inter tracking-[0.18] border-b border-[#2E3348] md:table-row block w-full mb-4 md:mb-0"
                >
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Name:{' '}
                    </span>
                    {provider.name}
                  </td>
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Contact:{' '}
                    </span>
                    <div>
                      <div className="text-sm">{provider.email}</div>
                      <div className="text-sm opacity-75">
                        {provider.contact || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Joined:{' '}
                    </span>
                    {new Date(provider.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Designation:{' '}
                    </span>
                    {provider.designation}
                  </td>
                  <td className="py-3 px-4 md:table-cell block">
                    <span className="md:hidden font-semibold text-[#ADB3CC]">
                      Status:{' '}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-[4px] ${
                        provider.status === 'active'
                          ? 'bg-[rgba(0,222,115,0.10)] text-[#00DE73]'
                          : 'bg-[rgba(255,56,56,0.10)] text-[#FF3838]'
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 md:table-cell block">
                    <button
                      onClick={() =>
                        handleStatusToggle(provider.id, provider.status)
                      }
                      className={`flex items-center gap-2 px-3 py-1 rounded-[37px] ${
                        provider.status === 'active'
                          ? 'bg-[#F20303] text-white hover:bg-[#d60303]'
                          : 'bg-[#00DE73] text-white hover:bg-[#00c567]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={provider.status === 'active' ? faBan : faCheck}
                      />
                      {provider.status === 'active' ? 'Suspend' : 'Activate'}
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

export default ServiceProviders;
