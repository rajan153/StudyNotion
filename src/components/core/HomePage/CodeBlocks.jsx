import React from "react";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

function CodeBlocks({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeBlocks,
  backgroundGradient,
  codeColour,
}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 lg:gap-10`}>
      {/* Section 1 */}
      <div className="w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-medium text-[16px] leading-6">{subHeading}</div>
        {/* Buttons */}
        <div className="flex gap-7 mt-7 text-white">
          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            <div className="flex items-center gap-2">
              {ctaBtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
            {ctaBtn2.btnText}
          </CTAButton>
        </div>
      </div>
      {/* Section 2 */}
      <div className="h-fit flex flex-row text-[10px] w-[100%] py-3 code-border leading-[18px]
      sm:leading-6 sm:text-sm relative lg:w-[450px]">
        {/* BackGround Gradient */}
        {backgroundGradient}
        <div
          className="flex flex-col text-center w-[10%] text-richblack-400 font-inter
          font-bold select-none"
        >
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColour} pr-1 leading-6 text-[14px]`}>
          <TypeAnimation 
            sequence={[codeBlocks, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{whiteSpace:"pre-line", display:"block"}}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeBlocks;
