
const express = require('express');
const taskController = require("../controller/task.Controller")

const router=express.Router();

router.post("/create",taskController.createTask);
router.get("/getAlltask",taskController.getAllTasks);
router.get("/getUserTasks",taskController.getUserTasks);
router.get("/:id",taskController.getTaskById);
router.put("/updatetodos/:id",taskController.updateTaskTodos);



module.exports=router;