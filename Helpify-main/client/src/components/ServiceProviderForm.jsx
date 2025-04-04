import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { getUser } from '../utills/user';

function ServiceProviderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Debug current storage content
  useEffect(() => {
    const debugUserData = () => {
      // Debug localStorage
      const rawStorageData = localStorage.getItem('user');
      console.log('Raw localStorage data:', rawStorageData);

      try {
        const parsedStorageData = rawStorageData
          ? JSON.parse(rawStorageData)
          : null;
        console.log('Parsed localStorage data:', parsedStorageData);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }

      // Debug context
      console.log('Context user data:', user);
    };

    debugUserData();
  }, [user]);

  // Get user data from multiple sources to ensure we have it
  useEffect(() => {
    const getUserData = () => {
      try {
        // First try context
        if (user) {
          console.log('Found user in context:', user);
          setUserData(user);
          return;
        }

        // Then try localStorage
        const storedUserStr = localStorage.getItem('user');
        if (!storedUserStr) {
          console.error('No user data found in localStorage');
          return;
        }

        const storedUser = JSON.parse(storedUserStr);

        // Check if we have a valid user object with required fields
        if (storedUser && storedUser.email && storedUser.roleId) {
          console.log('Valid user found in localStorage:', storedUser);
          setUserData(storedUser);
        } else {
          // Try to extract user data if it's nested
          const possibleUserData = storedUser?.user || storedUser;
          if (possibleUserData?.email && possibleUserData?.roleId) {
            console.log('Found nested user data:', possibleUserData);
            setUserData(possibleUserData);
          } else {
            console.error('Invalid user data structure:', storedUser);
            // Last resort - try getUser utility
            const fallbackUser = getUser();
            if (fallbackUser?.email && fallbackUser?.roleId) {
              console.log('Retrieved user from utility:', fallbackUser);
              setUserData(fallbackUser);
            } else {
              console.error('No valid user data found in any source');
              Swal.fire({
                icon: 'error',
                title: 'Session Error',
                text: 'Please log in again to continue',
                showConfirmButton: true,
              }).then(() => {
                logout();
                navigate('/auth/login');
              });
            }
          }
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, [user, logout, navigate]);

  const validationSchema = Yup.object({
    designation: Yup.string().required('Professional title is required'),
    location: Yup.string().required('Location is required'),
    ratePerHour: Yup.number()
      .required('Hourly rate is required')
      .min(1, 'Rate must be greater than 0'),
    experience: Yup.number()
      .required('Experience is required')
      .min(0, 'Experience cannot be negative'),
  });

  const formik = useFormik({
    initialValues: {
      designation: '',
      location: '',
      ratePerHour: '',
      experience: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        if (!userData) {
          console.error('No user data available for registration:', userData);

          // Try one more time to get user data directly
          const lastAttemptUserData = getUser();
          console.log('Last attempt to get user data:', lastAttemptUserData);

          if (lastAttemptUserData) {
            setUserData(lastAttemptUserData);
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'User information not found. Please log in again.',
              showConfirmButton: true,
            }).then(() => {
              logout();
              navigate('/auth/login');
            });
            return;
          }
        }

        // Extract the actual user ID from the token payload
        const tokenData = userData?.token?.token;
        let userId;

        if (tokenData) {
          try {
            // Decode the JWT token to get the user ID
            const base64Url = tokenData.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );

            const payload = JSON.parse(jsonPayload);
            userId = payload.id;
            console.log('Using user ID from token:', userId);
          } catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Failed to get user ID from token');
          }
        }

        if (!userId) {
          throw new Error('User ID not found in token');
        }

        // Use axiosInstance which has the interceptor to handle the token
        const response = await axiosInstance.post('/provider/register', {
          ...values,
          userId: userId,
        });

        console.log('Registration successful:', response.data);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title:
            'Registration successful! Please log in again as a service provider.',
          showConfirmButton: true,
        }).then(() => {
          // Logout the user
          logout();
          // Redirect to login page
          navigate('/auth/login');
        });
      } catch (error) {
        console.error('Error registering as service provider:', error);
        let errorMessage = 'Failed to register as service provider';

        // Extract detailed error message if available
        if (error.response) {
          console.error('Server response:', error.response.data);
          errorMessage = error.response.data.message || errorMessage;
        }

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: errorMessage,
          showConfirmButton: false,
          timer: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Register as a Service Provider
      </h2>

      {userData ? (
        <div className="mb-4 p-3 bg-green-50 rounded-md text-green-800 text-sm">
          Logged in as: {userData.firstName} {userData.lastName} (
          {userData.email})
        </div>
      ) : (
        <div className="mb-4 p-3 bg-red-50 rounded-md text-red-800 text-sm">
          User information not available. Please try logging in again.
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Designation / Professional Title */}
        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Professional Title
          </label>
          <input
            id="designation"
            name="designation"
            type="text"
            placeholder="e.g., Plumber, Electrician"
            className={`w-full p-3 border rounded-md ${
              formik.touched.designation && formik.errors.designation
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            value={formik.values.designation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.designation && formik.errors.designation && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.designation}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Service Area
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g., New York, NY"
            className={`w-full p-3 border rounded-md ${
              formik.touched.location && formik.errors.location
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.location && formik.errors.location && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.location}
            </p>
          )}
        </div>

        {/* Rate Per Hour */}
        <div>
          <label
            htmlFor="ratePerHour"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hourly Rate ($)
          </label>
          <input
            id="ratePerHour"
            name="ratePerHour"
            type="number"
            placeholder="Your hourly rate"
            className={`w-full p-3 border rounded-md ${
              formik.touched.ratePerHour && formik.errors.ratePerHour
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            value={formik.values.ratePerHour}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.ratePerHour && formik.errors.ratePerHour && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.ratePerHour}
            </p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years of Experience
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            placeholder="Years of professional experience"
            className={`w-full p-3 border rounded-md ${
              formik.touched.experience && formik.errors.experience
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            value={formik.values.experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.experience && formik.errors.experience && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.experience}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !userData}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition ${
              isLoading || !userData ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registering...' : 'Register as Service Provider'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default ServiceProviderForm;
