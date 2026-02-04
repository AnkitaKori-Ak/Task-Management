import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import checklistMan from '../../assets/Checklist man.json'
import Lottie from "lottie-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      s_email: formData.email,
      s_password: formData.password,
    },{ withCredentials: true });

    const user = res.data.user;
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login Successful");

    
    setTimeout(() => {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }, 1500);
  } catch (err) {
    if (err.response && err.response.data.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Something went wrong!");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen">
      {/* Right side */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <form
          className="bg-white p-8  hover:shadow-blue-200 hover:bg-blue-50 rounded-2xl shadow-lg w-3/4 max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Task Manager <span className="text-blue-500">Sign-In</span>
          </h2>

          <div className="mb-4">
            <label className="flex text-gray-700 mb-2 gap-2">
              <FaUser className="text-blue-500" /> Email
            </label>
            <input
              type="email"
              placeholder="Enter Email Here"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="flex text-gray-700 gap-2 mb-2">
              <FaLock className="text-blue-500" /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password Here"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label
              htmlFor="showPassword"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Show Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading} // ✅ disable during login
            className={`w-full py-2 rounded transition text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>

      {/* Left side */}
         <div className="w-1/2 flex flex-col justify-center items-center bg-white text-blue-500 text-4xl font-bold gap-4">
        <h1>Task Management System</h1>
        <div className="w-3/4">
          <Lottie animationData={checklistMan} loop={true} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

