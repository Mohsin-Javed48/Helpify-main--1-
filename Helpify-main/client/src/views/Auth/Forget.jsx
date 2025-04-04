import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import forgetIllustration from "/src/assets/images/auth/image.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { forgetPassword, resetPassword } from "../../api/auth";
import Swal from "sweetalert2";

export default function Forget() {
  const { token } = useParams();
  const navigate = useNavigate();

  const forgetValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const resetValidationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const forgetFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetValidationSchema,
    onSubmit: async (values) => {
      try {
        Swal.fire({
          title: "Verification",
          html: "Sending you the mail",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await forgetPassword(values);
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  const resetFormik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await resetPassword({ token: token, ...values });
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.message,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/auth/login");
      } catch (error) {
        console.log(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <div className="flex justify-around items-center h-full w-full min-h-screen bg-gray-100 p-4">
      {/* Left Section */}
      <div className="flex flex-col items-center gap-5 text-center">
        <div></div>
        <p className="text-lg font-bold text-gray-800">
          {token ? (
            "Reset Your Password"
          ) : (
            <>
              Did you forget <br /> your Password
            </>
          )}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center border-4 border-gray-800  rounded-3xl shadow-lg bg-white ">
        {/* Form Section */}
        <div className="p-6 flex flex-col justify-center bg-white sm:rounded-r-3xl  rounded-l-3xl w-80 md:h-96">
          <h3 className="text-center text-xl font-semibold mb-4">
            {token ? "Reset Password" : "Forget Password"}
          </h3>

          {token ? (
            <form onSubmit={resetFormik.handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block font-semibold mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  className={`w-full p-2 border rounded ${
                    resetFormik.touched.newPassword &&
                    resetFormik.errors.newPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={resetFormik.values.newPassword}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                />
                {resetFormik.touched.newPassword &&
                  resetFormik.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {resetFormik.errors.newPassword}
                    </p>
                  )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-semibold mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className={`w-full p-2 border rounded ${
                    resetFormik.touched.confirmPassword &&
                    resetFormik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={resetFormik.values.confirmPassword}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                />
                {resetFormik.touched.confirmPassword &&
                  resetFormik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {resetFormik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <form onSubmit={forgetFormik.handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full p-2 border rounded ${
                    forgetFormik.touched.email && forgetFormik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={forgetFormik.values.email}
                  onChange={forgetFormik.handleChange}
                  onBlur={forgetFormik.handleBlur}
                />
                {forgetFormik.touched.email && forgetFormik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {forgetFormik.errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Forget Password
              </button>

              <div className="flex items-center ">
                <hr className="flex-1" />
                <span className="px-2 text-gray-500">OR</span>
                <hr className="flex-1" />
              </div>

              <Link
                to="/auth/login"
                
              >
                <button
                  type="submit"
                  className="w-full py-2 bg-yellow-500 text-white text-center rounded-lg hover:bg-yellow-600 transition"
                >
                  Login
                </button>
              </Link>
            </form>
          )}
        </div>

        {/* Illustration Section */}
        <div className="hidden md:block">
          <img
            src={forgetIllustration}
            className="h-96 object-contain rounded-r-3xl"
            alt="Forget illustration"
          />
        </div>
      </div>
    </div>
  );
}
