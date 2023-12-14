import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../Services/operations/authApi";
import Input from "../components/core/Auth/Input";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import OpenRoutes from "../components/common/OpenRoutes";

function UpdatePassword() {
  <OpenRoutes />;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit } = useForm();

  const submitPassword = (data) => {
    const token = location.pathname.split("/").at(-1);
    dispatch(
      resetPassword(data.password, data.confirmPassword, token, navigate)
    );
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h2 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new password
          </h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleSubmit(submitPassword)}>
            <div className="relative">
              <Input
                lable="Enter New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="form-style w-full !pr-10"
                {...register("password", { required: true })}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[13px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
            <div className="relative mt-3 block">
              <Input
                label="Enter Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm password"
                className="form-style w-full !pr-10"
                {...register("confirmPassword", { required: true })}
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
