const pool = require("../config/db");

/* ===================== ADD COMMENT ===================== */
exports.addComment = async (comment) => {
  const sql = `
    INSERT INTO tbl_task_comments
    (n_tid, n_eid, s_comments, d_created_at)
    VALUES (?, ?, ?, CURDATE())
  `;

  const [result] = await pool.query(sql, [
    comment.n_tid,
    comment.n_eid,
    comment.s_comments,
  ]);

  return result.insertId;
};

/* ===================== GET COMMENTS BY TASK ===================== */
exports.getCommentsByTask = async (taskId) => {
  const sql = `
    SELECT 
      c.n_cid,
      c.n_tid,
      c.n_eid,
      c.s_comments,
      c.d_created_at,
      e.s_fullname AS employee_name
    FROM tbl_task_comments c
    JOIN tbl_employee e ON c.n_eid = e.n_eid
    WHERE c.n_tid = ?
    ORDER BY c.d_created_at DESC
  `;

  const [rows] = await pool.query(sql, [taskId]);
  return rows;
};
