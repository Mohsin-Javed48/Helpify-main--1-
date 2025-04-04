import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCheck,
  faTimes,
  faSort,
  faSortUp,
  faSortDown,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

function Complaints() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/complains');
      if (response.data.success) {
        setComplaints(response.data.complains || []);
      } else {
        setError(response.data.message || 'Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError(error.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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

  const handleResolve = async (complaintId) => {
    try {
      const response = await axiosInstance.patch(`/complains/${complaintId}`, {
        status: 'resolved',
      });
      if (response.data.success) {
        fetchComplaints(); // Refresh the list
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const handleReject = async (complaintId) => {
    try {
      const response = await axiosInstance.patch(`/complains/${complaintId}`, {
        status: 'rejected',
      });
      if (response.data.success) {
        fetchComplaints(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting complaint:', error);
    }
  };

  const handleViewDetails = (complaintId) => {
    // In real app, this would open a modal or navigate to details page
    console.log('View details for complaint:', complaintId);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-500">Loading complaints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#ADB3CC]">Complaints</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search complaints..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#1D2134] text-[#ADB3CC] border-[#2E3348]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ADB3CC]"
          />
        </div>
      </div>

      <div className="bg-[#1D2134] rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#161928]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider">
                Subject
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Date {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#ADB3CC] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1D2134] divide-y divide-[#2E3348]">
            {filteredComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#ADB3CC]">
                    {complaint.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#ADB3CC]">
                    {complaint.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#ADB3CC]">
                    {complaint.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ADB3CC]">
                  {formatDate(complaint.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      complaint.status === 'resolved'
                        ? 'bg-[rgba(0,222,115,0.10)] text-[#00DE73]'
                        : complaint.status === 'rejected'
                          ? 'bg-[rgba(255,56,56,0.10)] text-[#FF3838]'
                          : 'bg-[rgba(255,193,7,0.10)] text-[#FFC107]'
                    }`}
                  >
                    {complaint.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(complaint.id)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  {(!complaint.status || complaint.status === 'pending') && (
                    <>
                      <button
                        onClick={() => handleResolve(complaint.id)}
                        className="text-[#00DE73] hover:text-green-400 mr-4"
                        title="Resolve"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => handleReject(complaint.id)}
                        className="text-[#FF3838] hover:text-red-400"
                        title="Reject"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Complaints;
