import Home from "./components/core/HomePage/Home.jsx";
import OpenRoute from "./components/common/OpenRoutes.jsx";
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Settings from "./components/core/Dashboard/Settings/Index.jsx";
import { ACCOUNT_TYPE } from "./utils/constants.js";
import Instructor from "./components/core/Dashboard/InstructorDashBoard/Instructor.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/common/Footer.jsx";
import Navbar from "./components/common/Navbar.jsx";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen flex flex-col font-inter items-center bg-richblack-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="catalog/:catalogName" element={<Catalog/>} />
      <Route path="courses/:courseId" element={<CourseDetails/>} /> */}
        <Route
          path="/signup"
          element={
              <SignupPage />
          }
        />
        <Route
          path="/login"
          element={
              <LoginPage />
          }
        />
        <Route
          path="/forgot-password"
          element={
              <ForgetPassword />
          }
        />

        <Route
          path="/verify-email"
          element={
              <VerifyEmail />
          }
        />
        <Route
          path="/update-password/:id"
          element={
              <UpdatePassword />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          element={
              <Dashboard />
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />

          <Route path="dashboard/Settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              {/* <Route path="dashboard/cart" element={<Cart />} /> */}
              <Route
                path="dashboard/enrolled-courses"
                // element={<EnrolledCourses />}
              />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              {/* <Route path="dashboard/add-course" element={<AddCourse />} /> */}
              {/* <Route path="dashboard/my-courses" element={<MyCourses />} /> */}
              <Route
                path="dashboard/edit-course/:courseId"
                // element={<EditCourse />}
              />
            </>
          )}
        </Route>

        <Route element={<PrivateRoute>{/* <ViewCourse /> */}</PrivateRoute>}>
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                // element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
