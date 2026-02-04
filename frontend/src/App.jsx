import React from "react";
import LoginPage from "./Pages/Auth/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage";

import Dashboard from "./Pages/Admin/Dashboard";
import ManageTasks from "./Pages/Admin/ManageTasks";
import CreateTask from "./Pages/Admin/CreateTask";
import ManageUsers from "./Pages/Admin/ManageUsers";

import UserDashboard from "./Pages/User/UserDashboard";
import Mytasks from "./Pages/User/Mytasks";
import ViewTaskDetails from "./Pages/User/ViewTaskDetails";

import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Routes/PrivateRoute";
import DashboardLayout from "./Components/DashboardLayout";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRole={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
        </Route>

        {/* user Routes */}
        <Route element={<PrivateRoute allowedRole={["employee"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<Mytasks />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
