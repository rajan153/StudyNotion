import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getPasswordResetToken } from "../Services/operations/authApi";
import Input from "../components/core/Auth/Input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import OpenRoutes from "../components/common/OpenRoutes";

function ForgetPassword() {
  <OpenRoutes />;
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  //   const loading = useSelector((state) => state.auth);
  const [sendEmail, setSendEmail] = useState(false);
  const { register, handleSubmit } = useForm();

  const forgetPasswordEmail = (data) => {
    console.log(data);
    dispatch(getPasswordResetToken(data.email, setSendEmail));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {
        <div className="max-w-[500px] p-4 lg:p-8">
          <h2 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!sendEmail ? "Reset your password" : "check your email"}
          </h2>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!sendEmail
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={handleSubmit(forgetPasswordEmail)}>
            {!sendEmail && (
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                className="form-style w-full"
                {...register("email", { required: true })}
              />
            )}
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              {!sendEmail ? "Submit" : "Reset Email"}
            </button>
          </form>
          <div>
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack />
                Back to login
              </p>
            </Link>
          </div>
        </div>
      }
    </div>
  );
}

export default ForgetPassword;
