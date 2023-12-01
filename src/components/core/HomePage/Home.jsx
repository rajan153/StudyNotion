import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./CTAButton";
import banner from "../../../assets/Images/banner.mp4";

function Home() {
  return (
    <div className=" max-w-[1120px] flex flex-col items-center justify-center">
      {/* Section - 1 */}
      <section>
        <div
          className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center 
        text-white justify-between gap-[38px]"
        >
          <Link to={"/signup"}>
            <div
              className="mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold
            text-richblack-200 transition-all duration-200 hover:scale-95 w-fit group
            drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none"
            >
              <div
                className="flex flex-row gap-2 items-center justify-center rounded-full px-10 py-[5px]
              group-hover:bg-richblack-900 transition-all duration-200"
              >
                <p className="text-[1rem] font-medium leading-6">Become an Instructor</p>
                <FaArrowRight />
              </div>
            </div>
          </Link>

          {/* Heading */}
          <h1 className="text-center text-4xl font-semibold tracking-[-0.72px]">
            Empower Your Future with{" "}
            <span
              className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]
            text-transparent bg-clip-text font-bold"
            >
              Coding Skills
            </span>
          </h1>
          {/* Description of Hero Section */}
          <p className="-mt-3 w-[90%] text-center text-[1rem] font-medium leading-6 text-richblack-300">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>
          {/* Call to Action (CTA) button  */}
          <div className="mt-8 flex flex-row gap-7">
            <CTAButton active={true} linkto={"/signup"}>
              Learn More
            </CTAButton>
            <CTAButton active={false} linkto={"/login"}>
              Book a Demo
            </CTAButton>
          </div>
        </div>
        {/* Video Part for Hero Page */}
        <div className="mx-3 my-7 mt-[58px] shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoplay
          >
            <source src={banner} type="video/mp4" />
          </video>
        </div>

        {/* Coding Blocks */}
      </section>
      {/* Section - 2 */}
      {/* Section - 3 */}
    </div>
  );
}

export default Home;
