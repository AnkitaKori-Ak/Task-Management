import React, { useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Task details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, commentRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/task/${id}`,{ withCredentials: true }),
          axios.get(`http://localhost:3000/api/comment/${id}`,{ withCredentials: true }),
        ]);
        setTask(taskRes.data.data);
        setComments(commentRes.data.data);
      } catch (err) {
        console.error("Error fetching task details:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post("http://localhost:3000/api/comment/add", {
        n_tid: id,
        n_eid: user.id,
        s_comments: newComment,
      },{ withCredentials: true });
      toast.success("Comment added!");
      setComments((prev) => [
        ...prev,
        { s_comments: newComment, s_fullname: user.fullName },
      ]);
      setNewComment("");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  if (!task)
    return <div className="p-10 text-gray-600 text-center">Loading task...</div>;

  // Parse todos
  let todos = [];
  try {
    todos = JSON.parse(task.s_description);
  } catch (e) {
    todos = [];
  }
  const total = todos.length;
  const completed = todos.filter((t) => t.isCompleted).length;
  const percentage = total ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Task Header */}
      <div className="bg-white rounded-2xl shadow-2xl  m-2 p-4">
        <h1 className="text-2xl font-bold text-gray-800">{task.s_title}</h1>
        <div className="flex gap-3 mt-3">
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
      </div>

      {/* Task Details */}
      <div className="flex-1 m-2">
        <div className="bg-white rounded-2xl shadow-2xl  p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Overview</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <b>Start:</b> {new Date(task.t_start_date).toLocaleDateString()}
            </p>
            <p>
              <b>Due:</b> {new Date(task.d_due_date).toLocaleDateString()}
            </p>
          </div>

          {/* Todos */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Todos:</h3>
            {todos.length ? (
              todos.map((todo, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={todo.isCompleted} readOnly />
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
              <p className="text-gray-500">{task.s_description}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Status</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Discussion Section */}
        <div className="bg-white rounded-2xl shadow-2xl  p-6 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Admin Reviews on Task
          </h2>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto m-2 space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No comments yet</p>
            ) : (
              comments.map((c, index) => (
                <div
                  key={index}
                  className={`flex ${
                    c.s_fullname === user.fullName
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      c.s_fullname === user.fullName
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{c.s_comments}</p>
                    <span className="block text-xs opacity-70 mt-1">
                      {c.s_fullname}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center border-t pt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border-none bg-gray-50 rounded-lg px-4 py-2 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            />
            <IoIosSend
              onClick={handleSendComment}
              className="text-blue-500 text-2xl ml-3 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDetails;
