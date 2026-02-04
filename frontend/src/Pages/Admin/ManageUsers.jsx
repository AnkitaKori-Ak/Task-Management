import React, { useEffect, useState } from "react";
import axios from "axios";

const statusBadge = (status, count) => {
  let bgColor = "", textColor = "";
  if (status === "Pending") {
    bgColor = "bg-purple-100"; textColor = "text-purple-600";
  } else if (status === "In Progress") {
    bgColor = "bg-blue-100"; textColor = "text-blue-600";
  } else if (status === "Completed") {
    bgColor = "bg-green-100"; textColor = "text-green-600";
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
      {count}
    </span>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const adminId = storedUser?.id;

  const fetchUsers = async () => {
    try {
      console.log("Fetching users for adminId:", adminId);
      const res = await axios.get(
        `http://localhost:3000/api/auth/assigned-users?adminId=${adminId}`,{ withCredentials: true }
      );
      console.log("API Response:", res.data);
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  if (adminId) fetchUsers();
}, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-l-2 border-red-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-l-2 border-purple-500 uppercase">Pending</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-l-2 border-blue-500 uppercase">In Progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-l-2 border-green-500 uppercase">Completed</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border-l-2 border-amber-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.empId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{user.empId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.empName}</td>
                <td className="px-6 py-4">{statusBadge("Pending", parseInt(user.pending))}</td>
                <td className="px-6 py-4">{statusBadge("In Progress", parseInt(user.inProgress))}</td>
                <td className="px-6 py-4">{statusBadge("Completed", parseInt(user.completed))}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {parseInt(user.pending) + parseInt(user.inProgress) + parseInt(user.completed)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;