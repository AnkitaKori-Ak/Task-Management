const taskService = require("../services/task.service");

/* ===================== CREATE TASK ===================== */
exports.createTask = async (req, res, next) => {
  try {
    const {
      s_title,
      s_description,
      n_assigned_to,
      n_created_by,
      s_priority,
      d_due_date,
    } = req.body;

    if (
      !s_title ||
      !s_description ||
      !n_assigned_to?.length ||
      !n_created_by ||
      !d_due_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const taskId = await taskService.createTaskWithAssignments({
      s_title,
      s_description,
      n_assigned_to,
      n_created_by,
      s_priority,
      d_due_date,
    });

    res.status(201).json({
      success: true,
      message: "Task created and employees assigned successfully",
      taskId,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== USER TASKS ===================== */
exports.getUserTasks = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const tasks = await taskService.getTasksByUser(userId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== ALL TASKS ===================== */
exports.getAllTasks = async (req, res, next) => {
  try {
    const { adminId } = req.query;

    const tasks = await taskService.getAllTasks(adminId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== TASK BY ID ===================== */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== UPDATE TODOS ===================== */
exports.updateTaskTodos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { s_description } = req.body;

    let todos;
    try {
      todos = JSON.parse(s_description);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid todos JSON",
      });
    }

    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;

    let status = "Pending";
    if (completed === total) status = "Completed";
    else if (completed > 0) status = "In Progress";

    await taskService.updateTaskTodos(id, todos, status);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      s_status: status,
    });
  } catch (error) {
    next(error);
  }
};



// const db = require('../config/db');

// const createTask = (req, res) => {
//   const {
//     s_title,
//     s_description,
//     n_assigned_to,
//     n_created_by,
//     s_priority,
//     d_due_date,
//   } = req.body;

//   if (!s_title || !s_description || !n_assigned_to?.length || !n_created_by || !d_due_date) {
//     return res.status(400).json({ message: "All required fields must be filled" });
//   }

//   const descriptionJSON = JSON.stringify(s_description);


//   const taskQuery = `
//     INSERT INTO tbl_tasks 
//     (s_title, s_description, n_created_by, d_due_date, s_priority, s_status)
//     VALUES (?, ?, ?, ?, ?, 'Pending')
//   `;

//   db.query(taskQuery, [s_title, descriptionJSON, n_created_by, d_due_date, s_priority || 'Medium'], (err, result) => {
//     if (err) {
//       console.error("Error inserting task:", err);
//       return res.status(500).json({ message: "Database error", error: err });
//     }

//     const taskId = result.insertId;

    
//     const assignmentValues = n_assigned_to.map(empId => [taskId, empId]);
//     const assignmentQuery = `
//       INSERT INTO tbl_task_assignments (n_tid, n_eid) VALUES ?
//     `;

//     db.query(assignmentQuery, [assignmentValues], (err2, result2) => {
//       if (err2) {
//         console.error("Error assigning employees:", err2);
//         return res.status(500).json({ message: "Database error assigning employees", error: err2 });
//       }

//       return res.status(201).json({
//         message: "Task created and employees assigned successfully",
//         taskId,
//         assignedEmployees: n_assigned_to
//       });
//     });
//   });
// };


// const getUserTasks = (req, res) => {
//   const { userId } = req.query;

//   let query = `
//     SELECT 
//       t.*,
//       COALESCE(GROUP_CONCAT(e.s_fullname SEPARATOR ', '), '') AS assigned_employees
//     FROM tbl_tasks t
//     LEFT JOIN tbl_task_assignments ta ON t.n_tid = ta.n_tid
//     LEFT JOIN tbl_employee e ON ta.n_eid = e.n_eid
//     WHERE ta.n_eid = ? 
//     GROUP BY t.n_tid
//     ORDER BY t.t_created_at DESC
//   `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching user tasks:", err);
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res.status(200).json(results);
//   });
// };



// const getAllTasks = (req, res) => {
//   const { adminId } = req.query;

//   let query = `
//     SELECT 
//       t.*,
//       COALESCE(GROUP_CONCAT(e.s_fullname SEPARATOR ', '), '') AS assigned_employees
//     FROM tbl_tasks t
//     LEFT JOIN tbl_task_assignments ta ON t.n_tid = ta.n_tid
//     LEFT JOIN tbl_employee e ON ta.n_eid = e.n_eid
//   `;

//   const values = [];

//   if (adminId) {
//     query += " WHERE t.n_created_by = ?";
//     values.push(adminId);
//   }

//   query += " GROUP BY t.n_tid ORDER BY t.t_created_at DESC"; // correct column name

//   db.query(query, values, (err, results) => {
//     if (err) {
//       console.error("Error fetching tasks:", err);
//       return res.status(500).json({ message: "Database error", error: err });
//     }

//     res.status(200).json(results);
//   });
// };



// const getTaskById = (req, res) => {
//   const { id } = req.params;

//   db.query("SELECT * FROM tbl_tasks WHERE n_tid = ?", [id], (err, results) => {
//     if (err) {
//       console.error("Error fetching task:", err);
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     if (results.length === 0)
//       return res.status(404).json({ message: "Task not found" });

//     res.status(200).json(results[0]);
//   });
// };


// const updateTaskTodos = (req, res) => {
//   const { id } = req.params;
//   const { s_description } = req.body; // JSON string of todos

//   let todos;
//   try {
//     todos = JSON.parse(s_description);
//   } catch (e) {
//     return res.status(400).json({ message: "Invalid todos JSON" });
//   }

//   const total = todos.length;
//   const completed = todos.filter((t) => t.isCompleted).length;

//   let s_status = "Pending";
//   if (completed === 0) s_status = "Pending";
//   else if (completed === total) s_status = "Completed";
//   else s_status = "In Progress";

//   db.query(
//     "UPDATE tbl_tasks SET s_description = ?, s_status = ? WHERE n_tid = ?",
//     [JSON.stringify(todos), s_status, id],
//     (err, result) => {
//       if (err) {
//         console.error("Error updating todos:", err);
//         return res.status(500).json({ message: "Database error", error: err });
//       }
//       res.status(200).json({ message: "Task updated successfully", s_status });
//     }
//   );
// };


// module.exports = {
//   createTask,
//   getAllTasks,
//   getTaskById,
//   updateTaskTodos,
//   getUserTasks
// };
