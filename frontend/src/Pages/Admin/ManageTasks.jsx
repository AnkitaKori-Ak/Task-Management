import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  let adminId = user && user.role === "admin" ? user.id : null;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/task/getAlltask?adminId=${adminId}`,{ withCredentials: true }
        );
        setTasks(res.data.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    if (adminId) fetchTasks();
  }, [adminId]);

  // Update comment input
  const handleCommentChange = (taskId, value) => {
    setCommentInput((prev) => ({ ...prev, [taskId]: value }));
  };

  // Send comment
  const handleSendComment = async (taskId) => {
    const comment = commentInput[taskId];
    if (!comment) return;

    try {
      await axios.post("http://localhost:3000/api/comment/add", {
        n_tid: taskId,
        n_eid: user.id,
        s_comments: comment,
      },{ withCredentials: true });

      toast.success("Comment sent!");

      setCommentInput((prev) => ({ ...prev, [taskId]: "" }));
    } catch (err) {
      console.error("Error sending comment:", err);
      toast.error("Failed to send comment");
    }
  };

  // Handle todo toggle
  const handleToggleTodo = async (taskId, todoIndex) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.n_tid === taskId) {
          let todos = [];
          try {
            todos = JSON.parse(task.s_description);
          } catch (e) {
            todos = [];
          }

          todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;

          return { ...task, s_description: JSON.stringify(todos) };
        }
        return task;
      })
    );

    try {
      // Update backend and get new s_status
      const taskToUpdate = tasks.find((t) => t.n_tid === taskId);
      let todos = [];
      try {
        todos = JSON.parse(taskToUpdate.s_description);
        todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
      } catch (e) {}

      const res = await axios.put(
        `http://localhost:3000/api/task/updatetodos/${taskId}`,
        { s_description: JSON.stringify(todos), },{ withCredentials: true }
      );

      // Update s_status in state dynamically
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.n_tid === taskId) {
            return { ...task, s_status: res.data.s_status };
          }
          return task;
        })
      );
    } catch (err) {
      console.error("Error updating todos:", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading tasks...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 cursor-pointer">
          {tasks.map((task) => {
            let todos = [];
            try {
              todos = JSON.parse(task.s_description);
            } catch (e) {
              todos = [];
            }

            const total = todos.length;
            const completed = todos.filter((t) => t.isCompleted).length;
            const percentage = total === 0 ? 0 : (completed / total) * 100;
            const statusText =
              completed === 0
                ? "Pending"
                : completed === total
                ? "Completed"
                : "In Progress";
            const progressColor =
              statusText === "Completed"
                ? "bg-green-500"
                : statusText === "In Progress"
                ? "bg-blue-500"
                : "bg-gray-400";

            return (
              <div
                key={task.n_tid}
                onClick={() => navigate(`/user/task-details/${task.n_tid}`)}
                className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-2xl hover:bg-blue-50 transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      task.s_priority === "High"
                        ? "bg-red-100 text-red-600"
                        : task.s_priority === "Medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {task.s_priority}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      task.s_status === "Pending"
                        ? "bg-purple-100 text-purple-600"
                        : task.s_status === "In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {task.s_status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.s_title}
                </h3>

                {/* Todos */}
                <div onClick={(e) => e.stopPropagation()} className="text-sm text-gray-600 mt-2 mb-3">
                  {todos.length > 0 ? (
                    todos.map((todo, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={todo.isCompleted}
                          onChange={() =>handleToggleTodo(task.n_tid, index)}
                        />
                        <span
                          className={
                            todo.isCompleted ? "line-through text-gray-400" : ""
                          }
                        >
                          {todo.text}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>{task.s_description}</p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-purple-500">
                      Status Bar
                    </span>
                    <span className="font-semibold text-purple-500">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColor}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>
                    <b>Start:</b>{" "}
                    {new Date(task.t_start_date).toLocaleDateString()}
                  </span>
                  <span>
                    <b>Due:</b> {new Date(task.d_due_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Assigned Employees */}
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Assigned To:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {task.assigned_employees ? (
                      task.assigned_employees.split(",").map((name, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                        >
                          {name.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">
                        No employees assigned
                      </span>
                    )}
                  </div>
                </div>
                {/* Discussion input only */}
                <div className="mt-3 flex items-center">
                  <input
                    onClick={(e) => e.stopPropagation()}
                    type="text"
                    placeholder="Admin Notes..."
                    className="mt-2 w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={commentInput[task.n_tid] || ""}
                    onChange={(e) =>
                      handleCommentChange(task.n_tid, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendComment(task.n_tid);
                    }}
                  />
                  <IoIosSend
                    className="text-white bg-blue-500 rounded-full p-1 text-3xl ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendComment(task.n_tid);
                    }}
                  />
                </div> 
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
