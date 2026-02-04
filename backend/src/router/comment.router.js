const express = require("express");
const commentController = require("../controller/comment.controller");

const router = express.Router();

router.post("/add", commentController.addComment);
router.get("/:taskId", commentController.getCommentsByTask);


module.exports=router;
