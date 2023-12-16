import React from "react";
import { Outlet } from "react-router-dom";
import PrivateRoute from "../components/common/PrivateRoute";
import { useSelector } from "react-redux";
import SideBar from "../components/core/Dashboard/SideBar"

function Dashboard() {
  <PrivateRoute />;
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full">
      <SideBar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
