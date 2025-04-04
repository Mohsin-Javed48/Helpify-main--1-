import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import ComplaintCard from '../../ui/ComplaintCard.jsx';
import Swal from 'sweetalert2';

function ComplaintsPage() {
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
      if (error.response?.status === 401) {
        setError('Please login as admin to view complaints');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch complaints');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/complains/${complaintId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Complaint ${newStatus} successfully`,
          confirmButtonColor: '#3085d6',
        });
        fetchComplaints(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text:
          error.response?.data?.message || 'Failed to update complaint status',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleDelete = async (complaintId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const response = await axiosInstance.delete(
          `/complains/${complaintId}`
        );

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Complaint has been deleted.',
          });
          fetchComplaints();
        }
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete complaint',
      });
    }
  };

  return (
    <>
      {/*Complaints Page*/}
      <div className="px-4 sm:px-6 py-4 w-full min-h-[100vh] bg-[#161928]">
        {/* Page Title */}
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-semibold text-[#ADB3CC] tracking-[-0.64px] mt-2 mb-6">
          Complaints
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#ADB3CC]">Loading complaints...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-8">
            <div className="text-[#FF3838]">{error}</div>
          </div>
        )}

        {/* Complaint Cards */}
        {!loading && !error && (
          <div className="flex flex-col gap-5 p-4">
            {complaints.length === 0 ? (
              <div className="text-center text-[#ADB3CC]">
                No complaints found
              </div>
            ) : (
              complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  customerName={complaint.fullName}
                  customerId={complaint.id}
                  complaintText={complaint.message}
                  email={complaint.email}
                  subject={complaint.subject}
                  status={complaint.status}
                  createdAt={complaint.createdAt}
                  onResolve={() => handleStatusUpdate(complaint.id, 'resolved')}
                  onReject={() => handleStatusUpdate(complaint.id, 'rejected')}
                  onDelete={() => handleDelete(complaint.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ComplaintsPage;
