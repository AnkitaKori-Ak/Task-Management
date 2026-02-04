const pool = require("../config/db");

/* ===================== CREATE TASK ===================== */
exports.createTaskWithAssignments = async (task) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const taskSql = `
      INSERT INTO tbl_tasks
      (s_title, s_description, n_created_by, d_due_date, s_priority, s_status)
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    const [taskResult] = await connection.query(taskSql, [
      task.s_title,
      JSON.stringify(task.s_description),
      task.n_created_by,
      task.d_due_date,
      task.s_priority || "Medium",
    ]);

    const taskId = taskResult.insertId;

    const assignmentValues = task.n_assigned_to.map((eid) => [
      taskId,
      eid,
    ]);

    const assignSql = `
      INSERT INTO tbl_task_assignments (n_tid, n_eid)
      VALUES ?
    `;

    await connection.query(assignSql, [assignmentValues]);

    await connection.commit();
    return taskId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/* ===================== USER TASKS ===================== */
exports.getTasksByUser = async (userId) => {
  const sql = `
    SELECT 
      t.*,
      COALESCE(GROUP_CONCAT(e.s_fullname SEPARATOR ', '), '') AS assigned_employees
    FROM tbl_tasks t
    LEFT JOIN tbl_task_assignments ta ON t.n_tid = ta.n_tid
    LEFT JOIN tbl_employee e ON ta.n_eid = e.n_eid
    WHERE ta.n_eid = ?
    GROUP BY t.n_tid
    ORDER BY t.t_created_at DESC
  `;

  const [rows] = await pool.query(sql, [userId]);
  return rows;
};

/* ===================== ALL TASKS ===================== */
exports.getAllTasks = async (adminId) => {
  let sql = `
    SELECT 
      t.*,
      COALESCE(GROUP_CONCAT(e.s_fullname SEPARATOR ', '), '') AS assigned_employees
    FROM tbl_tasks t
    LEFT JOIN tbl_task_assignments ta ON t.n_tid = ta.n_tid
    LEFT JOIN tbl_employee e ON ta.n_eid = e.n_eid
  `;

  const params = [];

  if (adminId) {
    sql += ` WHERE t.n_created_by = ?`;
    params.push(adminId);
  }

  sql += ` GROUP BY t.n_tid ORDER BY t.t_created_at DESC`;

  const [rows] = await pool.query(sql, params);
  return rows;
};

/* ===================== TASK BY ID ===================== */
exports.getTaskById = async (taskId) => {
  const [rows] = await pool.query(
    `SELECT * FROM tbl_tasks WHERE n_tid = ?`,
    [taskId]
  );
  return rows[0];
};

/* ===================== UPDATE TODOS ===================== */
exports.updateTaskTodos = async (taskId, todos, status) => {
  const sql = `
    UPDATE tbl_tasks
    SET s_description = ?, s_status = ?
    WHERE n_tid = ?
  `;

  await pool.query(sql, [
    JSON.stringify(todos),
    status,
    taskId,
  ]);

  return status;
};
