/** @format */

import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { FaEye as ViewPasswordIcon } from 'react-icons/fa';
import loginMen from '/src/assets/images/auth/image.png';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import Swal from 'sweetalert2';
import { setUser } from '../../utills/user';
import GoogleIcon from '../../assets/Google_icon';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login(values);

        console.log('Login response:', response);

        // Check if user is suspended (additional safety check)
        if (response.user.status === 'suspended') {
          Swal.fire({
            icon: 'error',
            title: 'Account Suspended',
            text: 'Your account has been suspended due to some issue. Please contact support for assistance.',
            confirmButtonColor: '#007bff',
          });
          return;
        }

        // Success Alert
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response?.message || 'Login successful!',
          showConfirmButton: false,
          timer: 1500,
        });

        // Create a complete user object with token included
        const userData = {
          ...response.user,
          token: response.token,
        };

        console.log('Storing user data:', userData);

        // Set user in localStorage and context
        setUser(userData);
        await authLogin(response.token.token, userData);

        // Wait a moment before reloading to ensure data is stored
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        // Enhanced Error Handling
        let errorMessage =
          error.response?.data?.message || 'An unexpected error occurred.';
        let errorTitle = 'Error';

        // Check if it's a suspended account error
        if (error.response?.status === 403) {
          errorTitle = 'Account Suspended';
        }

        Swal.fire({
          icon: 'error',
          title: errorTitle,
          text: errorMessage,
          confirmButtonColor: '#007bff',
        });

        console.error('Login error:', error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col lg:flex-row h-screen"
    >
      {/* Left side image section */}
      <div className="hidden lg:flex h-full w-full lg:w-8/12">
        <img
          src="../../public/login_pic.jpg"
          alt="login visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side login form section */}
      <div className="w-full lg:w-6/12 p-8 lg:p-12 flex flex-col justify-center">
        <div className="text-left mb-6">
          <h1 className="text-4xl font-bold">HELPIFY</h1>
          <p className="text-xs font-light tracking-widest mt-1">
            TRUSTED SERVICES AT YOUR FINGERTIPS.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-inter font-medium text-xl mb-7">
            Nice to see you
          </h2>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-3">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Email or phone number"
              className={`w-full bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                formik.touched.email && formik.errors.email
                  ? 'ring-2 ring-red-500'
                  : ''
              }`}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1 ml-3">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-3">
              Password
            </label>
            <div className="relative">
              <input
                type={viewPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className={`w-full bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                  formik.touched.password && formik.errors.password
                    ? 'ring-2 ring-red-500'
                    : ''
                }`}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1 ml-3">
                  {formik.errors.password}
                </div>
              )}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setViewPassword((prev) => !prev)}
              >
                {formik.values.password && <ViewPasswordIcon />}
              </div>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <Link to="/auth/forget">
            <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
              <p className="text-[#007bff] cursor-pointer">Forgot password?</p>
            </div>
          </Link>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full h-10 bg-[#007bff] text-white font-medium rounded-lg text-sm mt-4 hover:bg-[#0056b3] transition-colors"
          >
            Sign in
          </button>

          {/* Divider */}
          <hr className="border-t border-gray-200 w-full my-4" />

          {/* Sign up link */}
          <div className="text-center mt-4 text-sm">
            <p>
              Don't have an account?
              <Link
                to="/auth/register"
                className="text-[#007bff] cursor-pointer ml-1"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
