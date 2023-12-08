import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { useForm } from "react-hook-form";
import { sendOtp } from "../../../Services/operations/authApi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import setSignupData from "../../../slices/authSlice";
import Tab from "../../common/Tab";
import Input from "./Input";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  // Student or Instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const signupSubmit = (data) => {
    // Used after OTP Verification
    console.log(data);
    if(data.password !== data.confirmPassword) {
      toast.error("Passwords not match")
      return
    }
    dispatch(
      setSignupData(
        data.firstName,
        data.lastName,
        data.firstName,
        data.email,
        data.password,
        data.confirmPassword
      )
    );
    // Sending OTP to User
    dispatch(sendOtp(data.email, navigate));
    // toast.success("Otp Send")
  };

  // Data to pass to Tab components
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div>
      {/* Tab Data */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form
        onSubmit={handleSubmit(signupSubmit)}
        className="flex w-full flex-col gap-y-4"
      >
        <div className="flex gap-x-4">
          <Input
            label="First Name"
            placeholder="Enter first name"
            {...register("firstName", { required: true })}
          />
          <Input
            label="Last Name"
            placeholder="Enter last name"
            {...register("lastName", { required: true })}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          {...register("email", { required: true })}
        />
        <div className="flex gap-x-4">
          <div className="relative">
            <Input
              label="Create Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password", { required: true })}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </div>
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
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
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignUp;
