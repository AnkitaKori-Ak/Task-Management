import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LuListTodo } from "react-icons/lu";
import { IoIosCheckbox } from "react-icons/io";
import { FaPenAlt,FaCalendarAlt } from "react-icons/fa";
import { BsSpeedometer } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";


const CreateTask = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user?.id;

  const [employees, setEmployees] = useState([]); 
  const [taskData, setTaskData] = useState({
    s_title: "",
    n_assigned_to: [], 
    s_description: [],
    n_created_by: adminId,
    d_due_date: "",
    t_start_date: new Date().toISOString().slice(0, 16),
    s_priority: "Medium",
    s_status: "Pending",
  });

  const [newTodo, setNewTodo] = useState("");

  console.log(taskData.n_assigned_to);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/users");
        setEmployees(res.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  console.log(employees);

  // Add new todo
  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTaskData({
      ...taskData,
      s_description: [
        ...taskData.s_description,
        { text: newTodo, isCompleted: false },
      ],
    });
    setNewTodo("");
  };

  // Remove todo
  const removeTodo = (index) => {
    const updatedTodos = taskData.s_description.filter((_, i) => i !== index);
    setTaskData({ ...taskData, s_description: updatedTodos });
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "d_due_date") {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(value).setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Due date cannot be earlier than today");
      return;
    }
  }

  setTaskData({ ...taskData, [name]: value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/task/create", taskData, { withCredentials: true });
      toast.success("Task Created Successfully");
      setTaskData({
        s_title: "",
        n_assigned_to: [],
        s_description: [],
        n_created_by: adminId,
        d_due_date: "",
        t_start_date: new Date().toISOString().slice(0, 16),
        s_priority: "Medium",
        s_status: "Pending",
      });
      setNewTodo("");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error in Assigning Task");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
     
        <h2 className=" flex items-center justify-center gap-4 text-3xl font-bold mb-6 text-center text-black">
        <FaTasks className="text-blue-500 text-xl" /> Create Task
      </h2>


      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Title */}
        <div className="col-span-2">
          <label className="flex mb-1 gap-2 font-semibold"><FaPenAlt className="text-blue-500 text-xl" />Task Title</label>
          <input
            type="text"
            name="s_title"
            value={taskData.s_title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Assign To - Multi Select */}

        <div className="col-span-2">
          <label className="flex mb-1 font-semibold gap-2">
            <IoIosCheckbox className="text-blue-500 text-xl" />Select Employees to Assign Task
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {employees.map((emp) => (
              <label key={emp.n_eid} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={emp.n_eid}
                  checked={taskData.n_assigned_to.includes(emp.n_eid)}
                  onChange={(e) => {
                    const id = emp.n_eid;
                    if (e.target.checked) {
                      setTaskData({
                        ...taskData,
                        n_assigned_to: [...taskData.n_assigned_to, id],
                      });
                    } else {
                      setTaskData({
                        ...taskData,
                        n_assigned_to: taskData.n_assigned_to.filter(
                          (eid) => eid !== id
                        ),
                      });
                    }
                  }}
                />
                {emp.s_fullname}
              </label>
            ))}
          </div>
        </div>

        {/* Todos Input */}
        <div className="col-span-2">
          <label className="flex gap-2 mb-1 font-semibold "> <LuListTodo className="text-blue-500 text-xl" /> Todo List</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a todo"
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={addTodo}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* Display list of todos */}
          <ul className="mb-2">
            {taskData.s_description.map((todo, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1"
              >
                <span>{todo.text}</span>
                <button
                  type="button"
                  onClick={() => removeTodo(index)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Due Date */}
        <div>
  <label className="flex mb-1 font-semibold gap-2"> <FaCalendarAlt className="text-blue-500 text-xl"/>Due Date</label>
  <input
    type="date"
    name="d_due_date"
    value={taskData.d_due_date.split("T")[0]} // ensures proper YYYY-MM-DD format
    onChange={handleChange}
    min={new Date().toISOString().split("T")[0]} // prevents picking past dates
    className="border p-2 rounded w-full"
    required
  />
</div>


        {/* Start Date */}
        <div>
          <label className="flex mb-1 font-semibold gap-2"><FaCalendarAlt className="text-blue-500 text-xl" />Start Date</label>
          <input
            type="datetime-local"
            name="t_start_date"
            value={taskData.t_start_date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="flex mb-1 font-semibold gap-2"> <BsSpeedometer className="text-blue-500 text-xl" />Priority</label>
          <select
            name="s_priority"
            value={taskData.s_priority}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Low"> Low</option>
            <option value="Medium">Medium</option>
            <option value="High"> High</option>
          </select>
        </div>

        {/* Hidden Created By */}
        <input
          type="hidden"
          name="n_created_by"
          value={taskData.n_created_by}
        />

        {/* Submit */}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
