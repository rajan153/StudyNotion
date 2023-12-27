import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./CTAButton";
import banner from "../../../assets/Images/banner.mp4";
import CodeBlocks from "./CodeBlocks";
import TimelineSection from "./TimelineSection";
import LearningLanguageSection from "./LearningLanguageSection";
import InstructorSection from "./InstructorSection";
import ReviewSlider from "./ReviewSlider";
import ExploreMore from "./ExploreMore";

function Home() {
  return (
    <div className="w-full">
      {/* Section - 1 */}
      <section className="relative gap-8 mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex items-center rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900 gap-2">
              <p>
                Become an Instructor
              </p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <h1 className="text-center text-4xl font-semibold">
          Empower Your Future with{" "}
          <span
            className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]
            text-transparent bg-clip-text font-bold"
          >
            Coding Skills
          </span>
        </h1>
        {/* Description of Hero Section */}
        <p className="-mt-3 text-center w-[90%] mx-auto text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </p>
        {/* Call to Action (CTA) button  */}
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video Part for Hero Page */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={banner} type="video/mp4" />
          </video>
        </div>

        {/* Coding Blocks 1*/}
        <div className="flex flex-wrap">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <h2 className="text-4xl font-semibold">
                Unlock your{" "}
                <span
                  className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]
            text-transparent bg-clip-text font-bold"
                >
                  coding potential
                </span>{" "}
                with our online courses.
              </h2>
            }
            subHeading={
              <p>
                Our courses are designed and taught by industry experts who have
                years of experience in coding and are passionate about sharing
                their knowledge with you.
              </p>
            }
            ctaBtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctaBtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeBlocks={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
            codeColour={"text-yellow-25"}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>
        {/* Coding Blocks 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <h2 className="w-[100%] lg:w-[50%] text-4xl font-semibold">
                Start{" "}
                <span
                  className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]
            text-transparent bg-clip-text font-bold"
                >
                  coding in seconds
                </span>
              </h2>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctaBtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctaBtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeBlocks={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
            codeColour={"text-white"}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
        <ExploreMore />
      </section>
      {/* Section - 2 */}
      <div className="bg-pure-greys-5 text-richblack-700 ">
        <div className="homepage_bg h-[320px]">
          {/* Explore Full Catagory Section */}
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 mx-auto">
            <div className="h-[160px] lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>
        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8">
          {/* Job that is in Demand - Section 1 */}
          <div className="lg:mt-20 mb-10 mt-[100px] flex flex-col lg:flex-row justify-between gap-7 lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the skills you need for a{" "}
              <span
                className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]
            text-transparent bg-clip-text font-bold"
              >
                job that is in demand.
              </span>
            </div>
            <div className="flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div>
      </div>
      {/* Section - 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
        <h3 className="text-center text-4xl font-semibold mt-10">
          Reviews from other learners
        </h3>
        {/* Review Slider */}
        <ReviewSlider />
      </div>
    </div>
  );
}

export default Home;
