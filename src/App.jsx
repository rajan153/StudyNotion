import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter items-center bg-richblack-900">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
