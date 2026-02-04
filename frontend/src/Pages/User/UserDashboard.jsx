import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const UserDashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [dateInfo, setDateInfo] = useState("");
  const [userName, setUserName] = useState("");
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [barData, setBarData] = useState([
  { name: "High", count: 0 },
  { name: "Medium", count: 0 },
  { name: "Low", count: 0 },
]);


  useEffect(() => {
    // Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Date formatting (vanilla JS)
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setDateInfo(formatted);

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setUserName(user?.fullName || "User");


    // Fetch tasks for the logged-in admin
    const fetchTaskStats = async () => {
      try {
        if (!user?.id) return;

       const res = await axios.get(`http://localhost:3000/api/task/getUserTasks?userId=${user.id}`,{ withCredentials: true });

        const tasks = res.data.data; 
        console.log(tasks);

        
        const stats = {
          total: tasks.length,
          pending: tasks.filter((t) => t.s_status === "Pending").length,
          inProgress: tasks.filter((t) => t.s_status === "In Progress").length,
          completed: tasks.filter((t) => t.s_status === "Completed").length,
        };

         const priorityCounts = {
      High: tasks.filter((t) => t.s_priority === "High").length,
      Medium: tasks.filter((t) => t.s_priority === "Medium").length,
      Low: tasks.filter((t) => t.s_priority === "Low").length,
    };

     setBarData([
      { name: "High", count: priorityCounts.High },
      { name: "Medium", count: priorityCounts.Medium },
      { name: "Low", count: priorityCounts.Low },
    ]);

      setTaskStats(stats);
      } catch (err) {
        console.error("Error fetching task stats:", err);
      }
    };

    fetchTaskStats();
  }, []);

  
  const pieData = [
    { name: "Pending", value: taskStats.pending },
    { name: "In Progress", value: taskStats.inProgress },
    { name: "Completed", value: taskStats.completed },
  ];


  const pieColors = ["#a13bf5", "#f5ea1d", "#13eb37"]; 
  const barColors = ["#eb1613", "#f2dd1f", "#2cf243"]; 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Section (2/6 height) */}
      <div className="flex-col p-6 bg-white shadow-2xl rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Greeting & Date */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {greeting}! <span className="font-bold">{userName}</span>
            </h2>
            <p className="text-gray-500 mt-1">{dateInfo}</p>
          </div>
        </div>

        {/* Task Summary */}
        <div className="flex flex-wrap gap-4 mt-4 text-gray-700 text-sm justify-between">
          <div className="flex items-center ">
            <span className="font-medium border-l-4 border-r-4 p-1 text-red-600 border-red-500 bg-red-100 rounded-full">
              Total Tasks {taskStats.total}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium border-l-4 border-r-4 p-1 border-purple-500 bg-purple-100 text-purple-600 rounded-full ">
              Pending {taskStats.pending}
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium  border-l-4 border-r-4 p-1 bg-yellow-100 text-yellow-600 border-yellow-500 rounded-full ">
              In Progress {taskStats.inProgress}
            </span>
          </div>

          <div className="flex items-center p-2 ">
            <span className="font-medium border-l-4 border-r-4 p-1 bg-green-100 text-green-600 border-green-500 rounded-full">
              Completed {taskStats.completed}
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-4 gap-4 p-6 bg-white shadow-2xl rounded-3xl h-[400px]">
      
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Task Status
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120} 
                innerRadius={100} 
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Task Priority
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip /> 
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
