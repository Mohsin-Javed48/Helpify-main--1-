/** @format */

import { useState, useContext } from 'react';
// import Google_icon from "../assets/";
import { FaEye as ViewPasswordIcon } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function SignupPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password'); // Get value of password from forms

  function onSubmit(data) {
    try {
      login(data); // Using AuthContext login function
      console.log('jel');
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row h-screen"
    >
      {/* Left side image section */}
      <div className="hidden lg:flex h-full w-full lg:w-8/12">
        <img
          src="../../public/login_pic.jpg"
          alt="image not found"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side signup form section */}
      <div className="w-full lg:w-6/12 p-8 lg:p-12 flex flex-col justify-center">
        <div className="text-left mb-4">
          <h1 className="text-4xl font-bold">HELPIFY</h1>
          <p className="text-xs font-light tracking-widest mt-1">
            TRUSTED SERVICES AT YOUR FINGERTIPS.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-inter font-medium text-xl mb-2">
            Nice to see you
          </h2>

          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-3">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              {...register('name', { required: true, maxLength: 20 })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-3">
              Email Address
            </label>
            <input
              type="text"
              placeholder="Email or phone number"
              className="w-full bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
              {...register('email', { required: true, maxLength: 20 })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
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
                className="w-full bg-gray-200 text-gray-700 placeholder-gray-500 rounded-lg py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                {...register('password', { required: true, maxLength: 20 })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setViewPassword((prev) => !prev)}
              >
                {password && <ViewPasswordIcon />}
              </div>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
            <label className="flex items-center"></label>
            <p className="text-[#007bff] cursor-pointer">Forgot password?</p>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            className="w-full h-10 bg-[#007bff] text-white font-medium rounded-lg text-sm mt-2"
          >
            Sign up
          </button>

          {/* Divider */}
          <hr className="border-t border-gray-200 w-full my-2" />

          {/* Google sign-in button */}
          <button className="w-full h-10 bg-[#303030] text-white font-normal rounded-lg flex justify-center items-center text-sm">
            <Google_icon className="mr-2" /> Or sign in with Google
          </button>

          {/* Login link */}
          <div className="text-center mt-1 text-sm">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#007bff] cursor-pointer">
                Login now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignupPage;
