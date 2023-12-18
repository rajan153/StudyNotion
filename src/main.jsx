import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";

// const dispatch = useDispatch();
// const navigate = useNavigate();

// const { user } = useSelector((state) => state.profile);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//       {
//         path: "/signup",
//         element: <SignupPage />,
//       },
//       {
//         path: "/forget-password",
//         element: <ForgetPassword />,
//       },
//       {
//         path: "/verify-email",
//         element: <VerifyEmail />,
//       },
//       {
//         path: "/update-password",
//         element: <UpdatePassword />,
//       },
//       {
//         path: "/about",
//         element: <AboutPage />,
//       },
//       {
//         path: "/contact",
//         element: <Contact />,
//       },
//       {
//         element: <Dashboard />,
//         children: [
//           {
//             path: "dashboard/my-profile",
//             element: <MyProfile />,
//           },
//           {
//             path: "dashboard/Settings",
//             element: <Settings />,
//           },
//           {
//             path:"dashboard/instructor",
//             element:<Instructor />
//           }
//         ],
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <RouterProvider router={router} /> */}
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
