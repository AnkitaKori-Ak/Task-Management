const pool = require("../config/db");


exports.insertUser = async (user) => {
  const sql = `
    INSERT INTO tbl_employee
    (s_fullname, s_email, s_role, s_password)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    user.s_fullname,
    user.s_email,
    user.s_role,
    user.s_password,
  ]);

  return result.insertId;
};

exports.getUserByEmail = async (email) => {
  const sql = `
    SELECT 
      n_eid,
      s_fullname,
      s_email,
      s_role,
      s_password
    FROM tbl_employee
    WHERE s_email = ?
  `;

  const [rows] = await pool.query(sql, [email]);
  return rows[0];
};

exports.getAllUsers = async () => {
  const sql = `
    SELECT 
      n_eid,
      s_fullname,
      s_email,
      s_role
    FROM tbl_employee
  `;

  const [rows] = await pool.query(sql);
  return rows;
};


exports.getAssignedUsersByAdmin = async (adminId) => {
  const sql = `
    SELECT 
      e.n_eid AS empId,
      e.s_fullname AS empName,
      SUM(CASE WHEN t.s_status = 'Pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN t.s_status = 'In Progress' THEN 1 ELSE 0 END) AS inProgress,
      SUM(CASE WHEN t.s_status = 'Completed' THEN 1 ELSE 0 END) AS completed
    FROM tbl_employee e
    JOIN tbl_task_assignments ta ON e.n_eid = ta.n_eid
    JOIN tbl_tasks t ON ta.n_tid = t.n_tid
    WHERE t.n_created_by = ?
    GROUP BY e.n_eid, e.s_fullname
  `;

  const [rows] = await pool.query(sql, [adminId]);
  return rows;
};
