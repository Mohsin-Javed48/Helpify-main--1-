import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const ComplaintCard = ({
  customerName,
  customerId,
  complaintText,
  email,
  subject,
  status,
  createdAt,
  onResolve,
  onReject,
  onDelete,
}) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#1D2134] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#ADB3CC]">{subject}</h3>
          <p className="text-sm text-[#ADB3CC]">
            By: {customerName} ({email})
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            status
          )}`}
        >
          {status || 'pending'}
        </span>
      </div>

      <p className="text-[#ADB3CC] mb-4">{complaintText}</p>

      <div className="flex justify-between items-center">
        <p className="text-sm text-[#ADB3CC]">
          {createdAt && formatDate(createdAt)}
        </p>
        <div className="flex space-x-2">
          {(!status || status === 'pending') && (
            <>
              <button
                onClick={onResolve}
                className="p-2 text-[#00DE73] hover:bg-[rgba(0,222,115,0.10)] rounded-full transition-colors duration-200"
                title="Resolve"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                onClick={onReject}
                className="p-2 text-[#FF3838] hover:bg-[rgba(255,56,56,0.10)] rounded-full transition-colors duration-200"
                title="Reject"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-[#ADB3CC] hover:bg-[#2E3348] rounded-full transition-colors duration-200"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
