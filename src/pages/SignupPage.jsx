import React from 'react'
import Template from '../components/core/Auth/Template'
import signupImg from "../assets/Images/signup.webp"

function SignupPage() {
  return (
    <Template 
    title="Join the millions learning to code with StudyNotion for free"
    description="Build skills for today, tomorrow, and beyond."
    description2="Education to future-proof your career."
    image={signupImg}
    formType="signup"
     />
  )
}

export default SignupPage