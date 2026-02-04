const commentService = require("../services/comment.service");

/* ===================== ADD COMMENT ===================== */
exports.addComment = async (req, res, next) => {
  try {
    const { n_tid, n_eid, s_comments } = req.body;

    if (!n_tid || !n_eid || !s_comments) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const commentId = await commentService.addComment({
      n_tid,
      n_eid,
      s_comments,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      commentId,
    });
  } catch (error) {
    next(error);
  }
};

/* ===================== GET COMMENTS BY TASK ===================== */
exports.getCommentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await commentService.getCommentsByTask(taskId);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};


// const db = require('../config/db');


// // Add a new comment
// exports.addComment = (req, res) => {
//   const { n_tid, n_eid, s_comments } = req.body;

//   if (!n_tid || !n_eid || !s_comments) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = `
//     INSERT INTO tbl_task_comments (n_tid, n_eid, s_comments, d_created_at)
//     VALUES (?, ?, ?, CURDATE())
//   `;

//   db.query(query, [n_tid, n_eid, s_comments], (err, result) => {
//     if (err) {
//       console.error("Error adding comment:", err);
//       return res.status(500).json({ message: "Failed to add comment" });
//     }
//     res.status(200).json({ message: "Comment added successfully", insertId: result.insertId });
//   });
// };

// // Get all comments for a task
// exports.getCommentsByTask = (req, res) => {
//   const { taskId } = req.params;

//   const query = `
//     SELECT c.*, e.s_fullname AS employee_name
//     FROM tbl_task_comments c
//     JOIN tbl_employee e ON c.n_eid = e.n_eid
//     WHERE c.n_tid = ?
//     ORDER BY c.d_created_at DESC
//   `;

//   db.query(query, [taskId], (err, results) => {
//     if (err) {
//       console.error("Error fetching comments:", err);
//       return res.status(500).json({ message: "Failed to fetch comments" });
//     }
//     res.status(200).json(results);
//   });
// };
