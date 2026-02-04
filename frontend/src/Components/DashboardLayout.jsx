import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;