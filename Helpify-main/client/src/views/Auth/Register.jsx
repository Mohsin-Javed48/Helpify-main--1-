import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import registerMen from '/src/assets/images/auth/image.png';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import Swal from 'sweetalert2';

export default function Register() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(20, 'First name must be 20 characters or less')
      .required('First name is required'),
    lastName: Yup.string()
      .max(20, 'Last name must be 20 characters or less')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await register(values);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Congratulations! Your account was created successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/auth/login');
      } catch (error) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <div className="flex justify-around items-center w-full  bg-gray-100 p-4">
  
      {/* Right Section */}
      <div className="flex items-center border-4 border-black rounded-3xl shadow-lg bg-white  "  >
        {/* Form Section */}
        <div className="p-6  rounded-l-3xl w-96">
          <form onSubmit={formik.handleSubmit}>
            {/* First Name and Last Name */}
            <div className="flex gap-3 mb-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block font-semibold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className={`w-full p-3 mt-2 border rounded-md bg-gray-100 text-gray-800 ${
                    formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                )}
              </div>

              <div className="w-1/2">
                <label htmlFor="lastName" className="block font-semibold text-gray-700 ">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className={`w-full p-3 mt-2 border rounded-md bg-gray-100 text-gray-800 ${
                    formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold text-gray-700 ">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full p-3 border mt-2 rounded-md bg-gray-100 text-gray-800 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full p-3 mt-2 border rounded-md bg-gray-100 text-gray-800 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                className={`w-full p-3 border mt-2 rounded-md bg-gray-100 text-gray-800 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* Submit and Links */}
            <div className="flex flex-col ">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Register
              </button>
              <div className="flex items-center">
                <hr className="flex-1 border-gray-300" />
                <span className="mx-2 text-gray-500">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>
              <Link
                to="/auth/login"
                className="py-2 px-4 bg-yellow-500 text-white text-center rounded-lg hover:bg-yellow-600 transition"
              >
                Login
              </Link>
            </div>
          </form>
        </div>

        {/* Illustration Section */}
        <div className="hidden md:block">

          <img src={registerMen} className=" h-[41rem] object-contain rounded-r-3xl" alt="Register illustration" />
      </div>
      </div>
    </div>
  );
}
