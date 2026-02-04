import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { FaUser, FaLock } from "react-icons/fa";
import { PiCursorClickFill } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import tableAnimation from "../../assets/Time Table.json";
import Lottie from "lottie-react";


const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        s_fullname: formData.fullname,
        s_email: formData.email,
        s_password: formData.password,
        s_role: formData.role,
      },{ withCredentials: true });

      setMessage(res.data.message || "Registered successfully!");
      setFormData({ fullname: "", email: "", password: "", role: "" });
      toast.success("Logged In Successfully");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
        toast.error({ message });
      } else {
        setMessage("Something went wrong. Please try again.");
        toast.error({ message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Right side - form */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <form
          className="bg-white p-8 rounded-2xl hover:shadow-blue-200 hover:bg-blue-50 shadow-lg w-3/4 max-w-md transition"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Task Manager <span className="text-blue-500">Sign-Up</span>
          </h2>

          {/* Full Name */}
          <div className="mb-2">
            <label className="flex text-gray-700 mb-2 gap-2">
              {" "}
              <FaUser className="text-blue-500" /> Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="flex text-gray-700 mt-2 gap-2">
              <IoMail className="text-blue-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="flex text-gray-700 mt-2 gap-2">
              <FaLock className="text-blue-500" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div className="mb-2">
            <label className="flex text-gray-700 mt-2 gap-2">
              {" "}
              <PiCursorClickFill className="text-blue-500" />
              Role
            </label>
            <select
              required
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Loading button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already Registered?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </form>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white text-blue-500 text-4xl font-bold gap-4">
        <h1>Task Management System</h1>
        <div className="w-3/4">
          <Lottie animationData={tableAnimation} loop={true} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
