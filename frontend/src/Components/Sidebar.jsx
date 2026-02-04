import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTasks, FaPlus, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import defaultPic from "../assets/profilePic.png";
import toast from "react-hot-toast";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    toast.success("logout Successfull");
    navigate("/");
  }
  };

  return (
    <div className="h-screen bg-white shadow-2xl flex flex-col w-1/6 border-r border-gray-200">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 border-b border-gray-200">
        <img
          src={user?.profilePic || defaultPic}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-3"
        />
        <p className="text-l font-medium text-white bg-blue-500 rounded-lg px-3 py-1 mb-2">
          {user?.role === "admin" ? "Admin" : "Employee"}
        </p>
        <h3 className="text-lg font-semibold text-gray-800">
          {user?.fullName || "Name"}
        </h3>
        <p className="text-sm text-gray-500">
          {user?.email || "admin@email.com"}
        </p>
      </div>

      {user?.role === "admin" ? (
        <div className="flex flex-col mt-6 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <IoBarChartSharp className="text-blue-500" /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <FaTasks className="text-blue-500" /> Manage Task
          </NavLink>

          <NavLink
            to="/admin/create-task"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <FaPlus className="text-blue-500" /> Create Task
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <FaUsers className="text-blue-500" /> Manage Users
          </NavLink>
        </div>
      ) : (
        <div className="flex flex-col mt-6 space-y-2">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <IoBarChartSharp className="text-blue-500" /> Dashboard
          </NavLink>

          <NavLink
            to="/user/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 ml-4 rounded-l-lg font-medium hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                  : "text-slate-900"
              }`
            }
          >
            <FaTasks className="text-blue-500" /> My Tasks
          </NavLink>

        </div>
      )}

      <div className="mt-auto mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 ml-4 w-full px-4 py-2 rounded-l-lg bg-red-600 text-white hover:bg-red-400 transition mr-0"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

